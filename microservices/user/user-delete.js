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
        
        yield User.remove({ '_id': event.pathParameters.id });

        Util.handleRequests(200, 'Usuário removido.', null, callback);
    }).catch((error) => {
        errorMapper.handle(error, callback);
    });
};
