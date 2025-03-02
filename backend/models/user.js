const { DataTypes, DATE } = require('sequelize')
const { sequelize } = require('../config/db')

const User = sequelize.define(
	'User',
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		name: {
			type: DataTypes.STRING,
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			allowNull: false,
			unique: true, //уникальный майл
			validate: {
				isEmail: true, //проверка формата
			},
		},
		createdAt: {
			type: DataTypes.DATE,
			defaultValue: DataTypes.NOW,
		},
	},
	{
		timestamps: false,
	}
)
module.exports = User
