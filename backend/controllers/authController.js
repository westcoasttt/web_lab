import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/user.js'
import sendEmail from '../utils/sendEmail.js'
import LoginHistory from '../models/loginhistory.js'

export const register = async (req, res) => {
	const { email, name, password } = req.body

	if (!email || !name || !password) {
		return res.status(400).json({ message: 'Заполните все поля' })
	}
	try {
		const existingUser = await User.findOne({ where: { email } })
		if (existingUser) {
			return res.status(400).json({ message: 'Email уже используется' })
		}

		await User.create({ email, name, password })

		res.status(201).json({ message: 'Регистрация успешна' })
	} catch (error) {
		console.error('Ошибка при регистрации:', error)
		res.status(500).json({ message: 'Ошибка сервера' })
	}
}

export const login = async (req, res) => {
	const { email, password } = req.body
	const userIP = (
		req.headers['x-forwarded-for'] ||
		req.connection.remoteAddress ||
		''
	).split(',')[0]
	const userAgent = req.headers['user-agent']

	if (!email || !password) {
		return res.status(400).json({ message: 'Заполните все поля' })
	}

	try {
		const user = await User.findOne({ where: { email } })
		if (!user) {
			return res.status(400).json({ message: 'Пользователь не найден' })
		}

		const isMatch = await bcrypt.compare(password, user.password)
		if (!isMatch) {
			return res.status(400).json({ message: 'Неверный пароль' })
		}

		// Генерация JWT токена
		const token = jwt.sign(
			{ id: user.id, email: user.email },
			process.env.JWT_SECRET,
			{ expiresIn: '1h' } // срок действия токена
		)

		// Получаем последние N записей о входах пользователя
		const lastLogins = await LoginHistory.findAll({
			where: { userId: user.id },
			limit: 5, // например, последние 5 записей
			order: [['createdAt', 'DESC']], // сортируем по времени
		})

		let isNewDeviceOrIP = true

		// Проверяем на наличие совпадений по IP и User-Agent
		for (const login of lastLogins) {
			if (login.ip === userIP && login.userAgent === userAgent) {
				isNewDeviceOrIP = false
				break
			}
		}

		// Если новый IP-адрес или устройство
		if (isNewDeviceOrIP) {
			// Отправляем email-уведомление
			await sendEmail(
				user.email,
				'Новый вход в ваш аккаунт',
				`Мы заметили, что вы вошли в свой аккаунт с нового устройства или местоположения. Если это были не вы, пожалуйста, измените пароль.`
			)

			// Сохраняем информацию о новом входе
			await LoginHistory.create({
				userId: user.id,
				ip: userIP,
				userAgent: userAgent,
			})
		}

		res.status(200).json({ message: 'Вход успешен', token })
	} catch (error) {
		console.error('Ошибка при входе:', error.message || error) // Логирование ошибки
		res.status(500).json({ message: 'Ошибка сервера' })
	}
}
