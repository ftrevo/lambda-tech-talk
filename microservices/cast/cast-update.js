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

        let oldObject = yield Cast.findById(event.pathParameters.id).exec();

        if (!oldObject)
            return Util.handleRequests(404, 'Atriz/Ator não encontrado(a).', null, callback);

        let newObject = new Cast(Util.parseJson(event.body));
        delete newObject._doc._id;

        Util.updateObject(oldObject, newObject._doc);

        yield oldObject.save();

        Util.handleRequests(200, 'Atriz/Ator alterado(a).', null, callback);

    }).catch((error) => {
        errorMapper.handle(error, callback);
    });
};
