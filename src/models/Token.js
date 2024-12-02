import { DataTypes } from 'sequelize'
import sequelize from '../config/database.js' // Đảm bảo bạn có file cấu hình Sequelize

const Token = sequelize.define('Token', {
  token: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true // Đảm bảo token là duy nhất
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users', // Giả sử bạn có mô hình User
      key: 'id'
    }
  }
})

export default Token
