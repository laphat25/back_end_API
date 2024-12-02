import { DataTypes } from 'sequelize' // Import kiểu dữ liệu
import sequelize from '../config/database.js' // Kết nối cơ sở dữ liệu

// Định nghĩa bảng `Course`
const Course = sequelize.define('Course', {
  title: { type: DataTypes.STRING, allowNull: false }, // Tiêu đề khóa học (bắt buộc)
  description: { type: DataTypes.TEXT, allowNull: false }, // Mô tả khóa học
  start_date: { type: DataTypes.DATE, allowNull: false }, // Ngày bắt đầu khóa học
  end_date: { type: DataTypes.DATE, allowNull: false } // Ngày kết thúc khóa học
})

export default Course // Xuất model để sử dụng
