import { sequelize } from '../config/db';
import User from './user';
import Event from './event';
import LoginHistory from './loginhistory';

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
