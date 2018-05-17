// --------------- Import de arquivos do core --------------- //
const connection = require('lambda-techtalk-shared-libs').common.connection;
const errorMapper = require('lambda-techtalk-shared-libs').common.error;
const Cast = require('lambda-techtalk-shared-libs').model.Cast;
const Util = require('lambda-techtalk-shared-libs').common.util;
const co = require('lambda-techtalk-shared-libs').external.co;

let conn = null;

module.exports.invoke = (event, context, callback) => {
    co(function* () {
        conn = yield connection.generateConn(conn, context);

        let newObject = new Cast(Util.parseJson(event.body));

        yield newObject.save();

        Util.handleRequests(201, 'Atriz/Ator criado(a).', null, callback);
    }).catch((error) => {
        errorMapper.handle(error, callback);
    });
};
