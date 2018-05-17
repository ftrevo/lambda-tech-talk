// --------------- Import de arquivos do core --------------- //
const co = require('lambda-techtalk-shared-libs').external.co;
const connection = require('lambda-techtalk-shared-libs').common.connection;
const errorMapper = require('lambda-techtalk-shared-libs').common.error;
const User = require('lambda-techtalk-shared-libs').model.User;
const Util = require('lambda-techtalk-shared-libs').common.util;

let conn = null;

module.exports.invoke = (event, context, callback) => {
    co(function* () {
        conn = yield connection.generateConn(conn, context);

        if(event.requestContext.authorizer.role !== 'admin' &&
            event.requestContext.authorizer.user.toString() !== event.pathParameters.id)
            return Util.handleRequests(403, 'Forbidden', null, callback);

        let user = yield User.findById(event.pathParameters.id, { password: 0 });

        if (user)
            return Util.handleRequests(200, null, user, callback);

        return Util.handleRequests(404, 'Usuário não encontrado.', null, callback);
    }).catch((error) => {
        errorMapper.handle(error, callback);
    });
};
