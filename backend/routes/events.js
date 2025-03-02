const express = require('express')
const router = express.Router()
const { Event, User } = require('../models')
const uuidRegex = /^[0-9a-fA-F-]{36}$/i
const { parse } = require('dotenv')

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: API для управления мероприятиями
 */

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Получить список всех мероприятий (с пагинацией)
 *     tags: [Events]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Номер страницы
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Количество элементов на странице
 *     responses:
 *       200:
 *         description: Успешный ответ с массивом мероприятий
 *       500:
 *         description: Ошибка сервера
 */
router.get('/events', async (req, res) => {
	try {
		let { page = 1, limit = 10 } = req.query
		page = parseInt(page)
		limit = parseInt(limit)

		if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
			return res
				.status(400)
				.json({ error: 'Некорректные параметры page или limit' })
		}
		const offset = (page - 1) * limit
		const result = await Event.findAndCountAll({
			limit,
			offset,
			order: [['date', 'ASC']],
		})

		// Логирование для проверки результата
		console.log('Всего мероприятий:', result.count)
		console.log('Получено мероприятий:', result.rows.length)

		res.json({
			events: result.rows,
			total: result.count,
			totalPages: Math.ceil(result.count / limit),
			currentPage: page,
		})
	} catch (error) {
		console.error('Ошибка при получении мероприятий:', error)
		res.status(500).json({ error: 'Ошибка при получении мероприятий' })
	}
})

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: Получить мероприятие по ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID мероприятия (формат UUID)
 *     responses:
 *       200:
 *         description: Успешный ответ с найденным мероприятием
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: ID мероприятия
 *                 title:
 *                   type: string
 *                   description: Заголовок мероприятия
 *                 description:
 *                   type: string
 *                   description: Описание мероприятия
 *                 date:
 *                   type: string
 *                   format: date
 *                   description: Дата мероприятия
 *                 createdBy:
 *                   type: string
 *                   description: ID пользователя, создавшего мероприятие
 *       400:
 *         description: Некорректный формат ID
 *       404:
 *         description: Мероприятие с указанным ID не найдено
 *       500:
 *         description: Ошибка сервера
 */

// Функция для проверки формата UUID
function isValidUUID(id) {
	const uuidRegex =
		/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
	return uuidRegex.test(id)
}

// Получение одного мероприятия по ID
router.get('/events/:id', async (req, res) => {
	try {
		const { id } = req.params

		if (!isValidUUID(id)) {
			return res.status(400).json({ error: 'Некорректный формат ID' })
		}

		const event = await Event.findByPk(id)
		if (!event) {
			return res.status(404).json({ error: 'Мероприятие не найдено' })
		}

		res.status(200).json(event)
	} catch (error) {
		console.error('Ошибка при получении мероприятия:', error)
		res.status(500).json({ error: 'Ошибка сервера' })
	}
})
/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Создать новое мероприятие
 *     tags: [Events]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Заголовок мероприятия (обязательное поле)
 *               description:
 *                 type: string
 *                 description: Описание мероприятия
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Дата мероприятия в формате YYYY-MM-DD (обязательное поле)
 *               createdBy:
 *                 type: string
 *                 description: ID пользователя, создавшего мероприятие (обязательное поле)
 *     responses:
 *       201:
 *         description: Мероприятие успешно создано
 *       400:
 *         description: Ошибка валидации
 *       404:
 *         description: Пользователь с указанным ID не найден
 *       500:
 *         description: Ошибка сервера
 */

// Создание мероприятия
router.post('/events', async (req, res) => {
	try {
		const { title, description, date, createdBy } = req.body

		// Проверка наличия обязательных полей
		if (!title || !date || !createdBy) {
			return res.status(400).json({ error: 'Отсутствуют обязательные поля' })
		}

		// Проверка длины заголовка
		if (title.length < 3 || title.length > 100) {
			return res
				.status(400)
				.json({ error: 'Заголовок должен содержать от 3 до 100 символов' })
		}

		// Проверка длины описания (если передано)
		if (description && description.length > 500) {
			return res
				.status(400)
				.json({ error: 'Описание не должно превышать 500 символов' })
		}

		// Проверка формата даты (YYYY-MM-DD)
		if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
			return res
				.status(400)
				.json({ error: 'Некорректный формат даты (YYYY-MM-DD)' })
		}
		// Проверка корректности ID пользователя (если передан)
		if (createdBy && !uuidRegex.test(createdBy)) {
			return res
				.status(400)
				.json({ error: 'Некорректный формат ID пользователя' })
		}

		// Проверяем существование пользователя, если передан `createdBy`
		if (createdBy) {
			try {
				const user = await User.findByPk(createdBy)
				if (!user) {
					return res
						.status(404)
						.json({ error: 'Пользователь с указанным ID не найден' })
				}
			} catch (dbError) {
				console.error(
					'Ошибка при запросе к базе данных (User.findByPk):',
					dbError
				)
				return res
					.status(500)
					.json({ error: 'Ошибка сервера при проверке пользователя' })
			}
		}

		// Создание мероприятия
		const newEvent = await Event.create({ title, description, date, createdBy })
		res.status(201).json(newEvent)
	} catch (error) {
		console.error('Ошибка при создании мероприятия:', error)
		res.status(500).json({ error: 'Ошибка при создании мероприятия' })
	}
})

/**
 * @swagger
 * /api/events/{id}:
 *   put:
 *     summary: Обновить данные мероприятия
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID мероприятия, которое нужно обновить
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Новая конференция"
 *               description:
 *                 type: string
 *                 example: "Обновленное описание конференции"
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2025-04-15"
 *               createdBy:
 *                 type: string
 *                 example: "9748b0cb-489b-457b-85d1-7ccddb435a88"
 *     responses:
 *       200:
 *         description: Мероприятие успешно обновлено
 *       400:
 *         description: Некорректные данные
 *       404:
 *         description: Мероприятие не найдено
 *       500:
 *         description: Ошибка сервера
 */

// Обновление мероприятия
router.put('/events/:id', async (req, res) => {
	try {
		const { title, description, date, createdBy } = req.body
		const { id } = req.params

		// Проверка корректности ID мероприятия
		if (!uuidRegex.test(id)) {
			return res
				.status(400)
				.json({ error: 'Некорректный формат ID мероприятия' })
		}

		// Проверка корректности ID пользователя (если передан)
		if (createdBy && !uuidRegex.test(createdBy)) {
			return res
				.status(400)
				.json({ error: 'Некорректный формат ID пользователя' })
		}

		const event = await Event.findByPk(id)
		if (!event) {
			return res
				.status(404)
				.json({ error: 'Мероприятие с указанным ID не найдено' })
		}

		if (createdBy) {
			try {
				const user = await User.findByPk(createdBy)
				if (!user) {
					return res
						.status(404)
						.json({ error: 'Пользователь с указанным ID не найден' })
				}
			} catch (dbError) {
				console.error(
					'Ошибка при запросе к базе данных (User.findByPk):',
					dbError
				)
				return res
					.status(500)
					.json({ error: 'Ошибка сервера при проверке пользователя' })
			}
		}

		// Проверка заголовка (title)
		if (
			!title ||
			typeof title !== 'string' ||
			title.length < 3 ||
			title.length > 100
		) {
			return res
				.status(400)
				.json({ error: 'Некорректный заголовок (3-100 символов)' })
		}

		// Проверка описания (description)
		if (description && typeof description !== 'string') {
			return res.status(400).json({ error: 'Некорректное описание' })
		}

		// Проверка формата даты (YYYY-MM-DD)
		if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
			return res
				.status(400)
				.json({ error: 'Некорректный формат даты (YYYY-MM-DD)' })
		}

		// Обновляем мероприятие
		await event.update({ title, description, date, createdBy })

		// Отправляем успешный ответ
		res.status(200).json({ message: 'Мероприятие успешно обновлено', event })
	} catch (error) {
		console.error('Ошибка при обновлении мероприятия:', error)
		res
			.status(500)
			.json({ error: 'Внутренняя ошибка сервера при обновлении мероприятия' })
	}
})

/**
 * @swagger
 * /api/events/{id}:
 *   delete:
 *     summary: Удалить мероприятие по ID
 *     tags: [Events]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID мероприятия
 *     responses:
 *       200:
 *         description: Мероприятие удалено
 *       400:
 *         description: Некорректный формат ID мероприятия
 *       404:
 *         description: Мероприятие не найдено
 *       500:
 *         description: Ошибка сервера
 */

// Удаление мероприятия
router.delete('/events/:id', async (req, res) => {
	try {
		const { id } = req.params

		// Проверка корректности ID мероприятия
		if (!uuidRegex.test(id)) {
			return res
				.status(400)
				.json({ error: 'Некорректный формат ID мероприятия' })
		}

		// Проверяем существование мероприятия
		const event = await Event.findByPk(id)
		if (!event) {
			return res.status(404).json({ error: 'Мероприятие не найдено' })
		}

		// Удаляем мероприятие
		await event.destroy()
		res.status(200).json({ message: 'Мероприятие успешно удалено' })
	} catch (error) {
		console.error('Ошибка при удалении мероприятия:', error)
		res
			.status(500)
			.json({ error: 'Внутренняя ошибка сервера при удалении мероприятия' })
	}
})

module.exports = router
