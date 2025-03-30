import dotenv from 'dotenv';
import express, { Application, Request, Response, NextFunction } from 'express';
import publicRouter from './routes/public';
import authRouter from './routes/auth';
import passport from './config/passport';
import { testConnection } from './config/db';
import { syncModels } from './models/index';
import cors, { CorsOptions } from 'cors';
import morgan from 'morgan';
import usersRouter from './routes/users';
import eventsRouter from './routes/events';
import { swaggerUi, swaggerSpec } from './swagger';

dotenv.config();

const app: Application = express();
const PORT: number = parseInt(process.env.PORT || '5000', 10);
const allowedOrigins: string[] =
  process.env.CORS_ALLOWED_ORIGINS?.split(',') || [];

app.use(passport.initialize());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
console.log(
  `Swagger-документация доступна по адресу: http://localhost:${PORT}/api-docs`,
);

const corsOptions: CorsOptions = {
  origin: allowedOrigins,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
};

app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin || '';
  const isLocalhost = !origin || origin.includes('localhost');
  const isTrustedOrigin = allowedOrigins.includes(origin);

  if (
    (req.method === 'DELETE' || req.method === 'PUT') &&
    !isLocalhost &&
    !isTrustedOrigin
  ) {
    res
      .status(403)
      .json({ error: 'Методы DELETE и PUT запрещены для внешних клиентов' });
  }
  next();
});

app.use(express.json());
app.use(cors(corsOptions));
app.use(morgan('[ :method ] :url :status :response-time ms'));

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Сервер работает! 🚀' });
});

app.use('/api/auth', authRouter);
app.use('/api/public', publicRouter);
app.use('/api/events', eventsRouter);
app.use('/api/user', usersRouter);

app.use((err: SyntaxError, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof SyntaxError) {
    res.status(400).json({ error: 'Неверный формат JSON' });
  }
  next(err);
});

app.use((req: Request, res: Response) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
  });
});

async function startServer() {
  try {
    await testConnection();
    await syncModels();
    app
      .listen(PORT, () => {
        console.log(`Сервер запущен на порту: ${PORT}`);
      })
      .on('error', (err: NodeJS.ErrnoException) => {
        console.error(`Ошибка при запуске: ${err.message}`);
      });
  } catch (error) {
    console.error(
      'Критическая ошибка при запуске сервера:',
      (error as Error).message,
    );
    process.exit(1);
  }
}

startServer();
