require('dotenv').config() // Загружаем переменные окружения из .env
const { sequelize, testConnection } = require('./config/db')
const { syncModels } = require('./models')
const express = require('express') //Подключаем express - для работы с сервером
const cors = require('cors') // Подключаем CORS для разрешения внешних запросов(с других)
const app = express() // Создаем экземпляр Express - объект приложения
const { swaggerUi, swaggerSpec } = require('./swagger')
const PORT = process.env.PORT
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
console.log(
	'Swagger-документация доступна по адресу: http://localhost:5000/api-docs'
)
const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS.split(',')
// Настройка CORS с использованием переменных окружения
const corsOptions = {
	origin: process.env.CORS_ALLOWED_ORIGINS.split(','), // Доверенные домены из .env
	methods: ['GET', 'POST'], // Разрешаем только GET и POST
	allowedHeaders: ['Content-Type', 'Authorization'], // Разрешаем только нужные заголовки
	preflightContinue: false,
	optionsSuccessStatus: 204,
}
// Кастомный middleware для ограничения методов DELETE и PUT
app.use((req, res, next) => {
	const origin = req.headers.origin
	const isLocalhost = !origin || origin.includes('localhost')

	// Проверяем, есть ли origin в списке доверенных доменов
	const isTrustedOrigin = allowedOrigins.includes(origin)

	if (
		(req.method === 'DELETE' || req.method === 'PUT') &&
		!isLocalhost &&
		!isTrustedOrigin
	) {
		return res
			.status(403)
			.json({ error: 'Методы DELETE и PUT запрещены для внешних клиентов' })
	}

	next()
})
app.use(express.json()) // Позволяет серверу обрабатывать JSON-запросы

app.use(cors(corsOptions))

const morgan = require('morgan')
app.use(morgan('[ :method ] :url :status :response-time ms'))

const usersRouter = require('./routes/users') // Импорт маршрутов пользователей
const eventsRouter = require('./routes/events') // Импорт маршрутов мероприятий
app.get('/', (req, res) => {
	res.json({ message: 'Сервер работает! 🚀' })
})
app.use('/api', eventsRouter)
app.use('/api', usersRouter)

async function startServer() {
	try {
		await testConnection()
		await syncModels()
		app
			.listen(PORT, () => {
				console.log(`Сервер запущен на порту: ${PORT}`)
			})
			.on('error', err => {
				console.error(`Ошибка при запуске: ${err.message}`)
			})
	} catch (error) {
		console.error('Критическая ошибка при запуске сервера:', error.message)
		process.exit(1)
	}
}
startServer()
