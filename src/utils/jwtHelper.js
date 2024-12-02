import jwt from 'jsonwebtoken'

// Hàm tạo access token (hết hạn sau 15 phút)
export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '1d' }
  )
}

// Hàm tạo refresh token (hết hạn sau 7 ngày)
export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '15d' }
  )
}
