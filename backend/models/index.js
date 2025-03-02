const User = require('./user')
const Event = require('./event')
const { sequelize } = require('../config/db')

// Настраиваем связь "один ко многим"
User.hasMany(Event, { foreignKey: 'createdBy', onDelete: 'CASCADE' })
Event.belongsTo(User, { foreignKey: 'createdBy' })
async function syncModels() {
	try {
		await sequelize.sync({ alter: true }) // Создаёт/обновляет таблицы в БД
	} catch (error) {
		console.error('❌ Ошибка при синхронизации моделей:', error.message)
	}
}

module.exports = { sequelize, syncModels, User, Event }
