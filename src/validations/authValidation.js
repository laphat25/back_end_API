import Joi from 'joi'
// Xác thực đăng ký
export const resgisterValidation = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('student', 'teacher').required()
})
// Xác thực khi đăng nhập
export const loginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
})
