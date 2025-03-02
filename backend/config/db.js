const { Sequelize } = require('sequelize')
require('dotenv').config()

const sequelize = new Sequelize(process.env.DB_URL, {
	dialect: 'postgres',
	logging: false, // Отключаем логи SQL-запросов
})

async function testConnection() {
	try {
		await sequelize.authenticate()
		console.log('✅ Подключение к БД установлено')
	} catch (error) {
		console.error('❌ Ошибка подключения к БД:', error.message)
		throw error // Передаём ошибку дальше, чтобы сервер не запускался
	}
}

module.exports = { sequelize, testConnection }
