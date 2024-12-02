import Course from '../models/Course.js'
import { StatusCodes } from 'http-status-codes'

// Create a course (Teachers only)
export const createCourse = async (req, res) => {
  const { title, description, start_date, end_date } = req.body
  const teacher_id = req.user.id

  try {
    const course = await Course.create({ title, description, start_date, end_date, teacher_id })
    res.status(StatusCodes.CREATED).json({ message: 'Course created successfully', course })
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message })
  }
}

// Get all courses
export const getCourses = async (req, res) => {
  try {
    const courses = req.user.role === 'teacher'
      ? await Course.findAll({ where: { teacher_id: req.user.id } })
      : await Course.findAll()

    res.status(StatusCodes.OK).json(courses)
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message })
  }
}
