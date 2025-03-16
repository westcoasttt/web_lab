import dotenv from 'dotenv' // загружаем переменные из .env
import { Sequelize } from 'sequelize'

dotenv.config()

// Создаем объект Sequelize
const sequelize = new Sequelize(
	process.env.DB_NAME,
	process.env.DB_USER,
	process.env.DB_PASSWORD,
	{
		host: process.env.DB_HOST,
		port: process.env.DB_PORT,
		dialect: 'postgres',
		logging: false, // Отключаем логи SQL-запросов
	}
)

// Функция проверки подключения
async function testConnection() {
	try {
		await sequelize.authenticate()
		console.log('Подключение к БД установлено')
	} catch (error) {
		console.error('Ошибка подключения к БД', error.message)
		throw error
	}
}

export { sequelize, testConnection } // Экспорт объекта для использования в модулях
