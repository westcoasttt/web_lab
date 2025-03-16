import dotenv from 'dotenv'
import express from 'express'
import publicRouter from './routes/public.js'
import authRouter from './routes/auth.js'
import passport from './config/passport.js'
import { sequelize, testConnection } from './config/db.js'
import { syncModels } from './models/index.js'
import cors from 'cors'
import morgan from 'morgan'
import usersRouter from './routes/users.js'
import eventsRouter from './routes/events.js'
import { swaggerUi, swaggerSpec } from './swagger.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT
const allowedOrigins = process.env.CORS_ALLOWED_ORIGINS.split(',')

app.use(passport.initialize())
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
console.log(
	'Swagger-документация доступна по адресу: http://localhost:5000/api-docs'
)

const corsOptions = {
	origin: allowedOrigins,
	methods: ['GET', 'POST'],
	allowedHeaders: ['Content-Type', 'Authorization'],
	preflightContinue: false,
	optionsSuccessStatus: 204,
}

app.use((req, res, next) => {
	const origin = req.headers.origin
	const isLocalhost = !origin || origin.includes('localhost')
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

app.use(express.json())
app.use(cors(corsOptions))
app.use(morgan('[ :method ] :url :status :response-time ms'))

app.get('/', (req, res) => {
	res.json({ message: 'Сервер работает! 🚀' })
})

app.use('/api/auth', authRouter)
app.use('/api/public', publicRouter)
app.use('/api/events', eventsRouter)
app.use('/api/user', usersRouter)
app.use((err, req, res, next) => {
	if (err instanceof SyntaxError) {
		return res.status(400).json({ error: 'Неверный формат JSON' })
	}
	next(err)
})

app.use((req, res, next) => {
	res.status(404).json({
		error: 'Not Found',
		message: `Cannot ${req.method} ${req.originalUrl}`,
	})
})

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
