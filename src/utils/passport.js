import { Strategy, ExtractJwt } from 'passport-jwt';
import User from '../models/Users';
const keys = process.env;

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.JWT_SECRET;

export const applyPassportStrategy = (passport) => {
    passport.use(
        new Strategy(opts, (jwt_payload, done) => {
            const email = jwt_payload.email;
            User.findOne({ email }, (err, user) => {
                if (err) return done(err, false);
                if (user) {
                    return done(null, user);
                }
                return done(null, false);
            });
        })
    );
};
