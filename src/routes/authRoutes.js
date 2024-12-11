import express from 'express'
import { register, login, refreshToken, logout } from '../controllers/authController.js'
import validateInput from '../middlewares/validateInput.js'
import { registerValidation, loginValidation } from '../validations/authValidation.js' // Chỉnh sửa từ resgisterValidation thành registerValidation

const router = express.Router() // Đảm bảo khai báo router trước khi sử dụng

// Route đăng ký (register)
router.post('/auth/register', validateInput(registerValidation), register)

// Route đăng nhập (login)
router.post('/auth/login', validateInput(loginValidation), login)

// Route làm mới token (refresh token)
router.post('/auth/refresh-token', refreshToken)

// Route đăng xuất (logout)
router.post('/auth/logout', logout)

export default router