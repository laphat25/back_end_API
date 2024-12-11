import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { StatusCodes } from 'http-status-codes'
import User from '../models/User.js'
import Token from '../models/Token.js'
import { generateAccessToken, generateRefreshToken } from '../utils/jwtHelper.js'

// Đăng ký người dùng mới
export const register = async (req, res) => {
  const { username, email, password, role = 'student' } = req.body

  try {
    // Kiểm tra xem email đã được đăng ký chưa
    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      return res.status(StatusCodes.CONFLICT).json({ error: 'Email already registered' })
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10)

    // Tạo người dùng mới
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role
    })

    res.status(StatusCodes.CREATED).json({
      message: 'User registered successfully',
      user: { id: newUser.id, username: newUser.username, email: newUser.email, role: newUser.role }
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
  }
}

// Đăng nhập người dùng
export const login = async (req, res) => {
  const { email, password } = req.body

  try {
    // Kiểm tra người dùng
    const user = await User.findOne({ where: { email } })
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Invalid credentials' })
    }

    // Tạo Access Token và Refresh Token
    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)

    // Lưu refresh token vào cơ sở dữ liệu
    await Token.create({ token: refreshToken, userId: user.id })

    // Gửi Access Token vào cookie
    res.cookie('accessToken', accessToken, {
      httpOnly: true, // Chỉ truy cập qua HTTP, bảo vệ chống XSS
      secure: process.env.NODE_ENV === 'production', // Sử dụng HTTPS trong môi trường production
      sameSite: 'strict', // Chống CSRF
      maxAge: 15 * 60 * 1000 // 15 phút
    })

    // Gửi Refresh Token vào cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true, // Bảo mật hơn bằng cách không cho phép JavaScript truy cập
      secure: process.env.NODE_ENV === 'production', // Chỉ sử dụng HTTPS trong production
      sameSite: 'strict', // Bảo vệ CSRF
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 ngày
    })

    res.status(StatusCodes.OK).json({
      message: 'Login successful'
    })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
  }
}

// Làm mới Access Token bằng Refresh Token
export const refreshToken = async (req, res) => {
  const refreshToken = req.cookies.refreshToken

  if (!refreshToken) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Refresh token is required' })
  }

  try {
    // Kiểm tra token trong cơ sở dữ liệu
    const storedToken = await Token.findOne({ where: { token: refreshToken } })
    if (!storedToken) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Invalid refresh token' })
    }

    // Xác thực refresh token
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    if (!payload.id || !payload.role) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Invalid token payload' })
    }

    // Tạo Access Token mới
    const newAccessToken = generateAccessToken({ id: payload.id, role: payload.role })
    res.status(StatusCodes.OK).json({ accessToken: newAccessToken })
  } catch (error) {
    // Nếu token hết hạn hoặc không hợp lệ, xóa refresh token
    await Token.destroy({ where: { token: refreshToken } })
    res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Invalid or expired refresh token' })
  }
}

// Đăng xuất người dùng
export const logout = async (req, res) => {
  const refreshToken = req.cookies.refreshToken

  if (!refreshToken) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Refresh token is required' })
  }

  try {
    // Xóa token khỏi cơ sở dữ liệu
    const deletedToken = await Token.destroy({ where: { token: refreshToken } })
    if (!deletedToken) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Token not found' })
    }

    // Xóa cookie chứa refreshToken
    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })

    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    })

    res.status(StatusCodes.OK).json({ message: 'Logged out successfully' })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
  }
}
