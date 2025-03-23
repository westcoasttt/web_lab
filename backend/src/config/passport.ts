import {
  Strategy as JwtStrategy,
  ExtractJwt,
  StrategyOptions,
} from 'passport-jwt';
import passport from 'passport';
import User from '../models/user';
import dotenv from 'dotenv';

dotenv.config();

interface JwtPayload {
  id: string;
}
const options: StrategyOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET as string,
};

passport.use(
  new JwtStrategy(options, async (payload: JwtPayload, done: Function) => {
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
  }),
);
export default passport;
