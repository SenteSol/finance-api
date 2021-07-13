const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose');
const User = mongoose.model('users');
const keys = process.env;

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.JWT_SECRET;

module.exports = passport => {
    passport.use(
        new JwtStrategy(opts, (jwt_payload, done) => {
            const email = jwt_payload.email;
            User.findOne({ email })
                .then(user => {
                    if (user) {
                        return done(null, user);
                    }
                    return done(null, false);
                })
                // eslint-disable-next-line no-console
                .catch(err => console.log(err));
        })
    );
};
