import { Event, User } from '../models/index';

// Получение всех мероприятий (с пагинацией)
export const getAllEvents = async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    if (isNaN(page) || isNaN(limit) || page < 1 || limit < 1) {
      return res
        .status(400)
        .json({ error: 'Некорректные параметры page или limit' });
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
export const getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidUUID(id)) {
      return res.status(400).json({ error: 'Некорректный формат ID' });
    }

    const event = await Event.findByPk(id);
    if (!event)
      return res.status(404).json({ error: 'Мероприятие не найдено' });

    res.status(200).json(event);
  } catch (error) {
    console.error('Ошибка при получении мероприятия:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

export const createEvent = async (req, res) => {
  try {
    const { title, description, date } = req.body;
    const createdBy = req.user.id; // Берем ID пользователя из токена

    if (!title || !date) {
      return res.status(400).json({ error: 'Отсутствуют обязательные поля' });
    }

    if (title.length < 3 || title.length > 100) {
      return res
        .status(400)
        .json({ error: 'Заголовок должен содержать от 3 до 100 символов' });
    }

    if (description && description.length > 500) {
      return res
        .status(400)
        .json({ error: 'Описание не должно превышать 500 символов' });
    }

    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res
        .status(400)
        .json({ error: 'Некорректный формат даты (YYYY-MM-DD)' });
    }

    const user = await User.findByPk(createdBy);
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
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
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, date, createdBy } = req.body;

    if (!isValidUUID(id)) {
      return res
        .status(400)
        .json({ error: 'Некорректный формат ID мероприятия' });
    }

    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ error: 'Мероприятие не найдено' });
    }

    if (createdBy && !isValidUUID(createdBy)) {
      return res
        .status(400)
        .json({ error: 'Некорректный формат ID пользователя' });
    }

    await event.update({ title, description, date, createdBy });
    res.status(200).json({ message: 'Мероприятие успешно обновлено', event });
  } catch (error) {
    console.error('Ошибка при обновлении мероприятия:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

// Удаление мероприятия
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidUUID(id)) {
      return res
        .status(400)
        .json({ error: 'Некорректный формат ID мероприятия' });
    }

    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ error: 'Мероприятие не найдено' });
    }

    await event.destroy();
    res.status(200).json({ message: 'Мероприятие успешно удалено' });
  } catch (error) {
    console.error('Ошибка при удалении мероприятия:', error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

// Функция проверки UUID
const isValidUUID = (id) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
