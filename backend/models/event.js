const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/db')
const User = require('./user') // Импортируем модель пользователя

const Event = sequelize.define(
	'Event',
	{
		id: {
			type: DataTypes.UUID,
			defaultValue: DataTypes.UUIDV4,
			primaryKey: true,
		},
		title: {
			type: DataTypes.STRING,
			allowNull: false, // Обязательное поле
		},
		description: {
			type: DataTypes.TEXT,
			allowNull: true,
		},
		date: {
			type: DataTypes.DATE,
			allowNull: false,
		},
		createdBy: {
			type: DataTypes.UUID,
			allowNull: false,
			references: {
				model: User,
				key: 'id',
			},
		},
	},
	{
		timestamps: false,
	}
)
module.exports = Event
