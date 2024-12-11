import JWT from 'jsonwebtoken' // Import từ jsonwebtoken
import ms from 'ms' // Sử dụng ms để xử lý thời gian hết hạn (tùy chọn)

// Kiểm tra biến môi trường
if (!process.env.ACCESS_TOKEN_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
  throw new Error('Missing token secrets in environment variables')
}

// Tạo Access Token (hết hạn sau 15 phút)
export const generateAccessToken = (user) => {
  try {
    return JWT.sign(
      { id: user.id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { algorithm: 'HS256', expiresIn: ms('10') / 1000 + 's' } // Sử dụng ms
    )
  } catch (err) {
    console.error('Error generating access token:', err.message)
    throw new Error('Failed to generate access token')
  }

}

// Tạo Refresh Token (hết hạn sau 7 ngày)
export const generateRefreshToken = (user) => {
  try {
    return JWT.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      { algorithm: 'HS256', expiresIn: ms('30') / 1000 + 's' } // Sử dụng ms
    )
  } catch (err) {
    console.error('Error generating refresh token:', err.message)
    throw new Error('Failed to generate refresh token')
  }

}
