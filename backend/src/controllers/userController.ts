import { Request, Response } from 'express';
import User from '../models/user';

interface AuthenticatedRequest extends Request {
  user?: { id: string };
}

// Получить информацию о пользователе
export const getUser = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Неавторизованный доступ' });
      return;
    }

    const user = await User.findByPk(req.user.id);
    if (!user) {
      res.status(404).json({ message: 'Пользователь не найден' });
      return;
    }

    res.status(200).json({ email: user.email, name: user.name });
  } catch (error) {
    console.error('Ошибка при получении пользователя:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

// Обновить информацию о пользователе
export const updateUser = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Неавторизованный доступ' });
      return;
    }

    const { name, email } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) {
      res.status(404).json({ message: 'Пользователь не найден' });
      return;
    }

    user.name = name || user.name;
    user.email = email || user.email;
    await user.save();

    res.status(200).json({ message: 'Данные обновлены' });
  } catch (error) {
    console.error('Ошибка при обновлении пользователя:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};
