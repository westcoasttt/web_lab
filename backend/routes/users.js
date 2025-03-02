const express = require('express')
const router = express.Router()
const { User } = require('../models')

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API для управления пользователями
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Получить список пользователей
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Успешный ответ с массивом пользователей
 *       500:
 *         description: Ошибка сервера
 */

// Получение списка всех пользователей
router.get('/users', async (req, res) => {
	try {
		const users = await User.findAll({
			attributes: ['id', 'name', 'email', 'createdAt'],
		})
		res.status(200).json(users)
	} catch (error) {
		res.status(500).json({ error: 'Ошибка сервера' })
	}
})

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Создать нового пользователя
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Пользователь успешно создан
 *       400:
 *         description: Ошибка в данных
 *       500:
 *         description: Ошибка сервера
 */

// Создание нового пользователя
router.post('/users', async (req, res) => {
	try {
		const { name, email } = req.body

		// Проверка наличия обязательных полей
		if (!name || !email) {
			return res.status(400).json({ error: 'Имя и email обязательны' })
		}

		// Проверка формата email
		const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
		if (!emailRegex.test(email)) {
			return res.status(400).json({ error: 'Некорректный формат email' })
		}

		// Проверка длины имени
		if (name.length < 3 || name.length > 100) {
			return res
				.status(400)
				.json({ error: 'Имя должно содержать от 3 до 100 символов' })
		}

		// Проверяем, существует ли пользователь с таким email
		const existingUser = await User.findOne({ where: { email } })
		if (existingUser) {
			return res
				.status(400)
				.json({ error: 'Пользователь с таким email уже существует' })
		}

		// Создание нового пользователя
		const newUser = await User.create({ name, email })
		res.status(201).json(newUser)
	} catch (error) {
		console.error('Ошибка при создании пользователя:', error)

		if (error.name === 'SequelizeValidationError') {
			return res.status(400).json({ error: 'Неверные данные' })
		}
		if (error.name === 'SequelizeDatabaseError') {
			return res.status(500).json({ error: 'Ошибка базы данных' })
		}

		res.status(500).json({ error: 'Ошибка при создании пользователя' })
	}
})

module.exports = router
