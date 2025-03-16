import { DataTypes } from 'sequelize'
import { sequelize } from '../config/db.js'
import User from './user.js'

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
			onDelete: 'CASCADE',
		},
	},
	{
		timestamps: false,
	}
)

User.hasMany(Event, { foreignKey: 'createdBy', onDelete: 'CASCADE' })
Event.belongsTo(User, { foreignKey: 'createdBy' })

export default Event
