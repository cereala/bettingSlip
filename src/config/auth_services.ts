import passport from 'passport'
import passportLocal  from 'passport-local';
import bcrypt from 'bcrypt'
import { db } from './dbConnection';
import {config} from './config'
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt';
import jsonwebtoken from 'jsonwebtoken'

const LocalStrategy = passportLocal.Strategy
const localOpts = {
    usernameField: 'username',
};
const localStrategy = new LocalStrategy(localOpts, async (username, password, done) => {
    try {
        db.tx(async transaction => {
            const usernameExists = await transaction.oneOrNone('SELECT user_id, username, password FROM users WHERE username = $1', username)
            if(!usernameExists) {
                return done(null, false)
            } else {
                const isMatch = await bcrypt.compare(password, usernameExists.password)
                if(isMatch) {
                    // add json webtoken to user
                    const jwt = jsonwebtoken.sign({
                        username: username
                    }, config.JWT_SECRET)
                    usernameExists.jwt = jwt
                    // await transaction.oneOrNone('UPDATE users SET token = $1 WHERE username = $2', [jwt, username])
                    return done(null, usernameExists)
                } else {
                    console.log('BAD Password!')
                    return done(null, false)
                }
            } 
        })
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
    const usernameExists = await db.oneOrNone('SELECT user_id, username FROM users WHERE username = $1', payload.username)
    if(!usernameExists) {
      return done(null, false)
    } 
    return done(null, usernameExists)
  } catch (e) {
    return done(e, false);
  }
});

// Strategy used for logging in with user and password and generating a JWT token
passport.use(localStrategy)

// Strategy with JWT token used for securing routes that users can only access/modify their data
passport.use(jwtStrategy)


export const authLocal = passport.authenticate('local', {session: false})
export const authJwt = passport.authenticate('jwt', { session: false });








