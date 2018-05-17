// --------------- Import de arquivos do core --------------- //
const connection = require('lambda-techtalk-shared-libs').common.connection;
const Cast = require('lambda-techtalk-shared-libs').model.Cast;
const errorMapper = require('lambda-techtalk-shared-libs').common.error;
const Util = require('lambda-techtalk-shared-libs').common.util;
const co = require('lambda-techtalk-shared-libs').external.co;

let conn = null;

module.exports.invoke = (event, context, callback) => {
    co(function* () {
        conn = yield connection.generateConn(conn, context);

        let cast = yield Cast.findById(event.pathParameters.id);

        if (!cast)
            return Util.handleRequests(404, 'Atriz/Ator não encontrado(a).', null, callback);

        return Util.handleRequests(200, null, cast, callback);
    }).catch((error) => {
        errorMapper.handle(error, callback);
    });
};
