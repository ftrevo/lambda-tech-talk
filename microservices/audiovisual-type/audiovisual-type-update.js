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

        let oldObject = yield AudiovisualType.findById(event.pathParameters.id).exec();

        if (!oldObject)
            return Util.handleRequests(404, 'Tipo de Produção Audiovisual não encontrado.', null, callback);

        let newObject = new AudiovisualType(Util.parseJson(event.body));
        delete newObject._doc._id;

        Util.updateObject(oldObject, newObject._doc);

        yield oldObject.save();

        Util.handleRequests(200, 'Tipo de Produção Audiovisual alterada.', null, callback);
    }).catch((error) => {
        errorMapper.handle(error, callback);
    });
};
