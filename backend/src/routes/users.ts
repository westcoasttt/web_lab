import express, { Request, Response } from 'express';
import passport from 'passport';
import { getUser, updateUser } from '../controllers/userController';

const router = express.Router();
interface AuthenticatedRequest extends Request {
  user?: { id: string }; // Указываем, что у `req.user` есть `id`
}
router.use(passport.authenticate('jwt', { session: false }));

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API для управления пользователями
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Получить список пользователей
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Успешный ответ с массивом пользователей
 *       500:
 *         description: Ошибка сервера
 */

router.get('/', (req: Request, res: Response) =>
  getUser(req as AuthenticatedRequest, res),
);

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Создать нового пользователя
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *     responses:
 *       201:
 *         description: Пользователь успешно создан
 *       400:
 *         description: Ошибка в данных
 *       500:
 *         description: Ошибка сервера
 */

// Обновить информацию о пользователе (требуется авторизация)
router.put('/', (req: Request, res: Response) =>
  updateUser(req as AuthenticatedRequest, res),
);

export default router;
