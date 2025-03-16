import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '../models/user.js'

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

		res.status(200).json({ message: 'Вход успешен', token })
	} catch (error) {
		console.error('Ошибка при входе:', error.message || error) // Логирование ошибки
		res.status(500).json({ message: 'Ошибка сервера' })
	}
}
