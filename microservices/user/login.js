// --------------- Import de arquivos do core --------------- //
const co = require('lambda-techtalk-shared-libs').external.co;
const jwt = require('lambda-techtalk-shared-libs').external.jsonwebtoken;
const connection = require('lambda-techtalk-shared-libs').common.connection;
const errorMapper = require('lambda-techtalk-shared-libs').common.error;
const User = require('lambda-techtalk-shared-libs').model.User;
const Util = require('lambda-techtalk-shared-libs').common.util;

let conn = null;

module.exports.invoke = (event, context, callback) => {
    co(function* () {
        conn = yield connection.generateConn(conn, context);

        let { email, password } = Util.parseJson(event.body);

        if (!email || !password) return Util.handleRequests(400, 'Dados inválidos.', null, callback);

        let user = yield User.findOne({ 'email': email }).exec();

        if (!user) return Util.handleRequests(404, 'Usuário não encontrado.', null, callback);

        let passwordMatch = yield user.comparePassword(password);

        if (!passwordMatch) return Util.handleRequests(401, 'Senha inválida.', null, callback);

        user = user.toObject();
        delete user.password;

        let token = jwt.sign(user, process.env.APP_SECRET, { expiresIn: '30 days' });

        Util.handleRequests(200, null, { token: 'JWT ' + token }, callback);

    }).catch((error) => {
        errorMapper.handle(error, callback);
    });
};
