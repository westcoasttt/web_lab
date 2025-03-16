// Модель входов пользователя (LoginHistory)
import { DataTypes } from 'sequelize'
import { sequelize } from '../config/db.js'
import User from './user.js'

const LoginHistory = sequelize.define('LoginHistory', {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		autoIncrement: true,
	},
	userId: {
		type: DataTypes.UUID,
		allowNull: false,
		references: {
			model: User,
			key: 'id',
		},
	},
	ip: {
		type: DataTypes.STRING,
		allowNull: false,
	},
	userAgent: {
		type: DataTypes.STRING,
		allowNull: false,
	},
})

User.hasMany(LoginHistory, { foreignKey: 'userId', onDelete: 'CASCADE' })
LoginHistory.belongsTo(User, { foreignKey: 'userId' })
export default LoginHistory
