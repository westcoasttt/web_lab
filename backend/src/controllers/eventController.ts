import { Request, Response } from 'express';
import { Event, User } from '@models/index';

interface AuthenticatedRequest extends Request {
  user?: { id: string }; // Указываем, что у `req.user` есть `id`
}

// Получение всех мероприятий (с пагинацией)
export const getAllEvents = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page as string);
    limit = parseInt(limit as string);

    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
      res.status(400).json({ error: 'Некорректные параметры page или limit' });
    }

    const offset = (page - 1) * limit;
    const result = await Event.findAndCountAll({
      limit,
      offset,
      order: [['date', 'ASC']],
    });

    res.json({
      events: result.rows,
      total: result.count,
      totalPages: Math.ceil(result.count / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error('Ошибка при получении мероприятий:', error);
    res.status(500).json({ error: 'Ошибка при получении мероприятий' });
  }
};

// Получение одного мероприятия по ID
export const getEventById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    if (!isValidUUID(id)) {
      res.status(400).json({ error: 'Некорректный формат ID' });
    }

    const event: Event | null = await Event.findByPk(id);
    if (!event) res.status(404).json({ error: 'Мероприятие не найдено' });

    res.status(200).json(event);
  } catch (error) {
    console.error('Ошибка при получении мероприятия:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

export const createEvent = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    const { title, description, date } = req.body;
    if (!req.user) {
      res.status(401).json({ error: 'Пользователь не авторизован' });
      return;
    }

    const createdBy = req.user.id; // Теперь безопасно

    if (!title || !date) {
      res.status(400).json({ error: 'Отсутствуют обязательные поля' });
    }

    if (title.length < 3 || title.length > 100) {
      res
        .status(400)
        .json({ error: 'Заголовок должен содержать от 3 до 100 символов' });
    }

    if (description && description.length > 500) {
      res
        .status(400)
        .json({ error: 'Описание не должно превышать 500 символов' });
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      res.status(400).json({ error: 'Некорректный формат даты (YYYY-MM-DD)' });
    }

    const user = await User.findByPk(createdBy);
    if (!user) {
      res.status(404).json({ error: 'Пользователь не найден' });
    }

    const newEvent = await Event.create({
      title,
      description,
      date,
      createdBy,
    });
    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Ошибка при создании мероприятия:', error);
    res.status(500).json({ error: 'Ошибка при создании мероприятия' });
  }
};

// Обновление мероприятия
export const updateEvent = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, description, date, createdBy } = req.body;

    if (!isValidUUID(id)) {
      res.status(400).json({ error: 'Некорректный формат ID мероприятия' });
      return;
    }

    const event = await Event.findByPk(id);
    if (!event) {
      res.status(404).json({ error: 'Мероприятие не найдено' });
      return;
    }

    if (createdBy && !isValidUUID(createdBy)) {
      res.status(400).json({ error: 'Некорректный формат ID пользователя' });
      return;
    }

    await event.update({ title, description, date, createdBy });
    res.status(200).json({ message: 'Мероприятие успешно обновлено', event });
  } catch (error) {
    console.error('Ошибка при обновлении мероприятия:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

// Удаление мероприятия
export const deleteEvent = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    if (!isValidUUID(id)) {
      res.status(400).json({ error: 'Некорректный формат ID мероприятия' });
    }

    const event = await Event.findByPk(id);
    if (!event) {
      res.status(404).json({ error: 'Мероприятие не найдено' });
      return;
    }

    await event.destroy();
    res.status(200).json({ message: 'Мероприятие успешно удалено' });
  } catch (error) {
    console.error('Ошибка при удалении мероприятия:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

// Функция проверки UUID
const isValidUUID = (id: string): boolean =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
