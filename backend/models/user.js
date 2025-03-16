import { DataTypes } from 'sequelize'
import { sequelize } from '../config/db.js'
import bcrypt from 'bcryptjs'

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
		password: {
			type: DataTypes.STRING,
			allowNull: false,
		},
	},
	{
		timestamps: true,
		hooks: {
			beforeCreate: async user => {
				user.password = await bcrypt.hash(user.password, 10)
			},
			beforeUpdate: async user => {
				if (user.changed('password')) {
					user.password = await bcrypt.hash(user.password, 10)
				}
			},
		},
	}
)

export default User
