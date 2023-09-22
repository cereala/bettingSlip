import passport from 'passport'
import passportLocal  from 'passport-local';
import bcrypt from 'bcrypt'
import { db } from './dbConnection';
import {config} from './config'
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';

const LocalStrategy = passportLocal.Strategy
const localOpts = {
    usernameField: 'username',
};
const localStrategy = new LocalStrategy(localOpts, async (username, password, done) => {
    try {
        const usernameExists = await db.oneOrNone('SELECT user_id, username, password FROM users WHERE username = $1', username)
        if(!usernameExists) {
            return done(null, false)
        } else {
            const isMatch = await bcrypt.compare(password, usernameExists.password)
            if(isMatch) {
                return done(null, usernameExists)
            } else {
                console.log('BAD Password!')
                return done(null, false)
            }
        } 
    } catch (error) {
        return done(error, false);
    }
})

// Jwt strategy
const jwtOpts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.JWT_SECRET,
};
  
const jwtStrategy = new JWTStrategy(jwtOpts, async (payload:any, done) => {
  try {
    console.log("payload")
    console.log(payload)
    //Identify user by ID
    const usernameExists = await db.oneOrNone('SELECT user_id, username, password FROM users WHERE username = $1', payload.username)
    console.log(usernameExists)
    if(!usernameExists) {
      console.log('JWT didnt find username: ' + usernameExists.username )
      return done(null, false)
  } else {
      const isMatch = await bcrypt.compare(payload.password, usernameExists.password)
      if(isMatch) {
          console.log('JWT good pwd')
          return done(null, usernameExists)
      } else {
          console.log('JWT bad pwd')
          return done(null, false)
      }
  }
  } catch (e) {
    return done(e, false);
  }
});
passport.use(localStrategy)
passport.use(jwtStrategy)


export const authLocal = passport.authenticate('local', {session: false})
export const authJwt = passport.authenticate('jwt', { session: false });








