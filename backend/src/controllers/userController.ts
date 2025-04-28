import { Request, Response } from 'express';
import User from '@models/user';
import { Event } from '@models/index';

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

    res.status(200).json({
      email: user.email,
      name: user.name,
      firstName: user.firstName,
      lastName: user.lastName,
      middleName: user.middleName,
      gender: user.gender,
      birthDate: user.birthDate,
    });
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

    const { name, email, firstName, lastName, middleName, gender, birthDate } =
      req.body;
    const user = await User.findByPk(req.user.id);

    if (!user) {
      res.status(404).json({ message: 'Пользователь не найден' });
      return;
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.middleName = middleName || user.middleName;
    user.gender = gender || user.gender;
    user.birthDate = birthDate || user.birthDate;
    await user.save();

    res.status(200).json({ message: 'Данные обновлены' });
  } catch (error) {
    console.error('Ошибка при обновлении пользователя:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};
export const getUserEvents = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Неавторизованный доступ' });
      return;
    }

    const events = await Event.findAll({
      where: { createdBy: req.user.id },
      order: [['date', 'ASC']],
    });

    res.status(200).json(events);
  } catch (error) {
    console.error('Ошибка при получении мероприятий пользователя:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};
