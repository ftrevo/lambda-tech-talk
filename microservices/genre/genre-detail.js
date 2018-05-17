// --------------- Import de arquivos do core --------------- //
const connection = require('lambda-techtalk-shared-libs').common.connection;
const Genre = require('lambda-techtalk-shared-libs').model.Genre;
const errorMapper = require('lambda-techtalk-shared-libs').common.error;
const Util = require('lambda-techtalk-shared-libs').common.util;
const co = require('lambda-techtalk-shared-libs').external.co;

let conn = null;

module.exports.invoke = (event, context, callback) => {
    co(function* () {
        conn = yield connection.generateConn(conn, context);

        let genre = yield Genre.findById(event.pathParameters.id);

        if (!genre)
            return Util.handleRequests(404, 'Gênero não encontrado.', null, callback);

        return Util.handleRequests(200, null, genre, callback);
    }).catch((error) => {
        errorMapper.handle(error, callback);
    });
};
