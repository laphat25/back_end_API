import Joi from 'joi'
//Xác thực thông tin khoá học 
export const courseValidation = Joi.object({
  title: Joi.string().min(5).required(),
  description: Joi.string().min(10).required(),
  start_date: Joi.date().required(),
  end_date: Joi.date().greater(Joi.ref('start_date')).required()
})