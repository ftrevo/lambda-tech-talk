// --------------- Import de dependências --------------- //
const co = require('lambda-techtalk-shared-libs').external.co;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const JwtStrategy = require('passport-jwt').Strategy;

// --------------- Import de arquivos do core --------------- //
const errorMapper = require('lambda-techtalk-shared-libs').common.error;
const Util = require('lambda-techtalk-shared-libs').common.util;
const User = require('lambda-techtalk-shared-libs').model.User;

module.exports = (passport) => {
    let options = {};

    options.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme('jwt');
    options.secretOrKey = process.env.APP_SECRET;
    options.passReqToCallback = true;

    passport.use(new JwtStrategy(options, (request, jwt_payload, done) => {
        co(function* () {
            let user = yield User.findById(jwt_payload._id).lean().exec();

            if (!user)
                throw new Error('Forbidden');

            delete user.password;

            request.user = user;
            return done(null, user);
        }).catch((error) => {
            errorMapper.handleExpress(error, request.res);
        });
    }));

};
