import jwt from 'jsonwebtoken'
import { StatusCodes } from 'http-status-codes'

// Middleware xác thực Access Token
export const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'No token provided' })
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY)
    req.user = decoded
    next()
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Access token expired' })
    }
    res.status(StatusCodes.FORBIDDEN).json({ error: 'Invalid token' })
  }
}

// Middleware kiểm tra quyền teacher
export const isTeacher = (req, res, next) => {
  if (!req.user) {
    return res.status(StatusCodes.UNAUTHORIZED).json({ error: 'Unauthorized' })
  } 
  next()
}
