// --------------- Import de dependências --------------- //
const connection = require('lambda-techtalk-shared-libs').common.connection;
const jwt = require('lambda-techtalk-shared-libs').external.jsonwebtoken;
const errorMapper = require('lambda-techtalk-shared-libs').common.error;
const User = require('lambda-techtalk-shared-libs').model.User;
const Util = require('lambda-techtalk-shared-libs').common.util;
const co = require('lambda-techtalk-shared-libs').external.co;

let conn = null;

module.exports.invokeAdmin = (event, context, callback) => {
    invoke(event, context, callback, 'admin');
};

module.exports.invokeUser = (event, context, callback) => {
    invoke(event, context, callback, 'user');
};


invoke = (event, context, callback, role) => {
    co(function* () {
        conn = yield connection.generateConn(conn, context);

        let user = new User(Util.parseJson(event.body));
        user.role = role;

        yield user.save();

        user = user.toObject();
        delete user.password;

        let token = jwt.sign(user, process.env.APP_SECRET, { expiresIn: '30 days' });

        Util.handleRequests(201, null, { message: 'Usuário criado.', token: 'JWT ' + token }, callback);

    }).catch((error) => {
        errorMapper.handle(error, callback);
    });
};