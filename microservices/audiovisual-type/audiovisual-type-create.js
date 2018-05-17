// --------------- Import de arquivos do core --------------- //
const connection = require('lambda-techtalk-shared-libs').common.connection;
const errorMapper = require('lambda-techtalk-shared-libs').common.error;
const AudiovisualType = require('lambda-techtalk-shared-libs').model.AudiovisualType;
const Util = require('lambda-techtalk-shared-libs').common.util;
const co = require('lambda-techtalk-shared-libs').external.co;

let conn = null;

module.exports.invoke = (event, context, callback) => {
    co(function* () {
        conn = yield connection.generateConn(conn, context);

        let newObject = new AudiovisualType(Util.parseJson(event.body));

        yield newObject.save();

        Util.handleRequests(201, 'Tipo de Produção Audiovisual criada.', null, callback);
    }).catch((error) => {
        errorMapper.handle(error, callback);
    });
};
