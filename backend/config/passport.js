import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import passport from 'passport'
import User from '../models/user.js'
import dotenv from 'dotenv'

dotenv.config()

const options = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.JWT_SECRET,
}

passport.use(
	new JwtStrategy(options, async (payload, done) => {
		try {
			console.log('JWT Payload:', payload) // Логируем информацию о токене
			const user = await User.findByPk(payload.id)
			if (user) {
				return done(null, user)
			}
			return done(null, false)
		} catch (error) {
			return done(error, false)
		}
	})
)
export default passport
