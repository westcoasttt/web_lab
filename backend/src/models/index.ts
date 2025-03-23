import { sequelize } from '../config/db.js';
import User from './user.js';
import Event from './event.js';
import LoginHistory from './loginhistory.js';

async function syncModels(): Promise<void> {
  try {
    await sequelize.sync({ alter: true }); // Создаёт/обновляет таблицы в БД
  } catch (error) {
    console.error(
      '❌ Ошибка при синхронизации моделей:',
      (error as Error).message,
    );
  }
}

export { sequelize, syncModels, User, LoginHistory, Event };
