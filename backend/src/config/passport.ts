import passport from 'passport';
import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions,
  VerifiedCallback,
} from 'passport-jwt';
import User from '@models/user';
import dotenv from 'dotenv';

dotenv.config();
// Проверяем и получаем секрет
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  throw new Error('Переменная окружения JWT_SECRET не определена.');
}
interface JwtPayload {
  id: string;
}

const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret,
};

passport.use(
  new JwtStrategy(
    options,
    async (payload: JwtPayload, done: VerifiedCallback) => {
      try {
        console.log('JWT Payload:', payload); // Логируем информацию о токене
        const user = await User.findByPk(payload.id);
        if (user) {
          return done(null, user);
        }
        return done(null, false);
      } catch (error) {
        return done(error as Error, false);
      }
    },
  ),
);

export default passport;
