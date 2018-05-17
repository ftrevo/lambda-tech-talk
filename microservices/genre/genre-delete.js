// --------------- Import de arquivos do core --------------- //
const connection = require('lambda-techtalk-shared-libs').common.connection;
const errorMapper = require('lambda-techtalk-shared-libs').common.error;
const Genre = require('lambda-techtalk-shared-libs').model.Genre;
const Util = require('lambda-techtalk-shared-libs').common.util;
const co = require('lambda-techtalk-shared-libs').external.co;

let conn = null;

module.exports.invoke = (event, context, callback) => {
    co(function* () {
        conn = yield connection.generateConn(conn, context);

        yield Genre.remove({ '_id': event.pathParameters.id });

        Util.handleRequests(200, 'Gênero removido.', null, callback);
    }).catch((error) => {
        errorMapper.handle(error, callback);
    });
};
