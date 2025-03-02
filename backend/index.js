require('dotenv').config() // Загружаем .env
const express = require('express')
const cors = require('cors')

const app = express() // Создаём приложение Express

app.use(express.json()) // Разбираем JSON в запросах
app.use(cors()) // Разрешаем CORS

const PORT = process.env.PORT || 3000 // Берём порт из .env или 3000

// Тестовый маршрут
app.get('/', (req, res) => {
	res.json({ message: 'Сервер работает! 🚀' })
})

// Запускаем сервер с обработкой ошибок
app
	.listen(PORT)
	.on('error', err => {
		console.error(`❌ Ошибка при запуске: ${err.message}`)
	})
	.on('listening', () => {
		console.log(`✅ Сервер запущен на порту ${PORT}`)
	})
