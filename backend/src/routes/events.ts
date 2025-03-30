import express, { Request, Response } from 'express';
import passport from '@config/passport';

import {
  createEvent,
  updateEvent,
  deleteEvent,
} from '../controllers/eventController';

const router = express.Router();
interface AuthenticatedRequest extends Request {
  user?: { id: string }; // Указываем, что у `req.user` есть `id`
}
router.use(passport.authenticate('jwt', { session: false }));

/**
 * @swagger
 * tags:
 *   name: Events
 *   description: API для управления мероприятиями
 */

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
router.post('/', (req: Request, res: Response) =>
  createEvent(req as AuthenticatedRequest, res),
);
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

router.put('/:id', (req: Request, res: Response) =>
  updateEvent(req as AuthenticatedRequest, res),
);

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

router.delete('/:id', (req: Request, res: Response) =>
  deleteEvent(req as AuthenticatedRequest, res),
);

export default router;
