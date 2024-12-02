import { Sequelize } from 'sequelize' // Sequelize là ORM để kết nối và quản lý cơ sở dữ liệu
import dotenv from 'dotenv' // Để sử dụng biến môi trường từ file `.env`

dotenv.config() // Load các biến từ file `.env`

// Tạo kết nối đến cơ sở dữ liệu
const sequelize = new Sequelize(
  process.env.DB_NAME || 'trello_api_db', // Tên cơ sở dữ liệu (mặc định: trello_api_db)
  process.env.DB_USER || 'root', // Tên user (mặc định: root)
  process.env.DB_PASSWORD || '', // Mật khẩu (mặc định là rỗng)
  {
    host: process.env.DB_HOST || 'localhost', // Địa chỉ của database (mặc định: localhost)
    dialect: 'mysql', // Loại cơ sở dữ liệu (ở đây là MySQL)
    logging: false // Tắt log query để gọn terminal (tuỳ chọn)
  }
);

// Kiểm tra kết nối
(async () => {
  try {
    await sequelize.authenticate()
    console.log('Database connected successfully!')
  } catch (error) {
    console.error('Unable to connect to the database:', error.message)
  }
})()

export default sequelize // Xuất kết nối để sử dụng trong các file khác
