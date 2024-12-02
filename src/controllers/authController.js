import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { StatusCodes } from 'http-status-codes'
import User from '../models/User.js'
import Token from '../models/Token.js'
import { generateAccessToken, generateRefreshToken } from '../utils/jwtHelper.js'

// Register new user
export const register = async (req, res) => {
  const { username, email, password, role = 'student' } = req.body

  try {
    const existingUser = await User.findOne({ where: { email } })
    if (existingUser) {
      return res.status(StatusCodes.CONFLICT).json({ error: 'Email already registered' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
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

// Login user
export const login = async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ where: { email } })
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Invalid credentials' })
    }

    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)

    await Token.create({ token: refreshToken, userId: user.id })

    res.status(StatusCodes.OK).json({ message: 'Login successful', accessToken, refreshToken })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
  }
}

// Refresh token
export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body

  if (!refreshToken) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Refresh token is required' })
  }

  try {
    const storedToken = await Token.findOne({ where: { token: refreshToken } })
    if (!storedToken) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Invalid refresh token' })
    }

    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
    if (!payload.id || !payload.role) {
      return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Invalid token payload' })
    }

    const newAccessToken = generateAccessToken({ id: payload.id, role: payload.role })
    res.status(StatusCodes.OK).json({ accessToken: newAccessToken })
  } catch (error) {
    res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Invalid or expired refresh token' })
  }
}

// Logout user
export const logout = async (req, res) => {
  const { refreshToken } = req.body

  if (!refreshToken) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: 'Refresh token is required' })
  }

  try {
    const deletedToken = await Token.destroy({ where: { token: refreshToken } })
    if (!deletedToken) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: 'Token not found' })
    }

    res.status(StatusCodes.OK).json({ message: 'Logged out successfully' })
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
  }
}
