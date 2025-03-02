require('dotenv').config()
const { Sequelize } = require('sequelize')
const sequelize = new Sequelize(
	process.env.DB_NAME,
	process.env.DB_USER,
	process.env.DB_PASSWORD,
	{
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		dialect: 'postgres',
		logging: false,
	}
)
async function testConnection() {
	try {
		await sequelize.authenticate()
		console.log('Подключение к БД установлено')
	} catch (error) {
		console.error('Ошибка подключения к БД', error.message)
		throw error
	}
}
module.exports = { sequelize, testConnection }
