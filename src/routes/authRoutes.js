import express from 'express'
import { register, login, refreshToken, logout } from '../controllers/authController.js'
import validateInput from '../middlewares/validateInput.js'
import { resgisterValidation, loginValidation } from '../validations/authValidation.js'

const router = express.Router() // Đảm bảo khai báo router trước khi sử dụng

router.post('/auth/register', validateInput(resgisterValidation), register)
router.post('/auth/login', validateInput(loginValidation), login)
router.post('/auth/refresh-token', refreshToken)
router.post('/auth/logout', logout)

export default router