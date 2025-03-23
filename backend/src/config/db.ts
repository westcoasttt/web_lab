import dotenv from 'dotenv'; // загружаем переменные из .env
import { Sequelize } from 'sequelize';

dotenv.config();

// Создаем объект Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASSWORD as string,
  {
    host: process.env.DB_HOS as string,
    port: parseInt(process.env.DB_PORT as string, 10),
    dialect: 'postgres',
    logging: false, // Отключаем логи SQL-запросов
  },
);

// Функция проверки подключения
async function testConnection(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log('Подключение к БД установлено');
  } catch (error) {
    console.error('Ошибка подключения к БД', (error as Error).message);
    throw error;
  }
}

export { sequelize, testConnection }; // Экспорт объекта для использования в модулях
