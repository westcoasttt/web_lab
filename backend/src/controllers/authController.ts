import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '@models/user';
import sendEmail from '@utils/sendEmail';
import LoginHistory from '@models/loginhistory';
import { JwtPayload } from 'jsonwebtoken';

interface TokenPayload extends JwtPayload {
  id: string;
  email: string;
}

export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, name, password } = req.body;

  if (!email || !name || !password) {
    res.status(400).json({ message: 'Заполните все поля' });
    return;
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: 'Email уже используется' });
      return; // 👈 ОБЯЗАТЕЛЬНО добавь return
    }

    await User.create({
      email,
      name,
      password,
    });

    res.status(201).json({ message: 'Регистрация успешна' });
  } catch (error) {
    console.error('Ошибка при регистрации:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  const userIP = (
    req.headers['x-forwarded-for'] ||
    req.socket.remoteAddress ||
    ''
  )
    .toString()
    .split(',')[0];

  const userAgent = req.headers['user-agent'] || '';

  if (!email || !password) {
    res.status(400).json({ message: 'Заполните все поля' });
    return;
  }

  if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET не установлен в .env файле');
    res.status(500).json({ message: 'Ошибка конфигурации сервера' });
    return;
  }

  try {
    const user = await User.findOne({
      where: { email },
      attributes: ['id', 'email', 'name', 'password'],
    });
    if (!user) {
      res.status(400).json({ message: 'Пользователь с таким email не найден' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(400).json({ message: 'Неверный пароль' });
      return;
    }

    // Генерация JWT токена
    const token = jwt.sign(
      { id: user.id as string, email: user.email } as TokenPayload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
    );

    const lastLogins = await LoginHistory.findAll({
      where: { userId: user.id },
      limit: 5,
      order: [['createdAt', 'DESC']],
    });

    const isNewDeviceOrIP = !lastLogins.some(
      (login) => login.ip === userIP && login.userAgent === userAgent,
    );

    // Если новый IP-адрес или устройство
    if (isNewDeviceOrIP) {
      await sendEmail(
        user.email,
        'Новый вход в ваш аккаунт',
        'Мы заметили, что вы вошли в свой аккаунт с нового устройства или местоположения. Если это были не вы, пожалуйста, измените пароль.',
      );

      await LoginHistory.create({
        userId: user.id,
        ip: userIP,
        userAgent,
      });
    }

    res.status(200).json({ message: 'Вход успешен', token, name: user.name });
  } catch (error) {
    console.error('Ошибка при входе:', (error as Error).message || error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};
