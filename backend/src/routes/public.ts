import express from 'express';
import { getAllEvents, getEventById } from '@controllers/eventController';

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Public
 *   description: Публичные маршруты
 */

/**
 * @swagger
 * /api/public:
 *   get:
 *     summary: Получить список всех мероприятий (с пагинацией)
 *     tags: [Public]
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
router.get('/', getAllEvents);

/**
 * @swagger
 * /api/public/{id}:
 *   get:
 *     summary: Получить мероприятие по ID
 *     tags: [Public]
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

router.get('/:id', getEventById);

export default router;
