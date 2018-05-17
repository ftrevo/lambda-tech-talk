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

        let oldObject = yield Genre.findById(event.pathParameters.id).exec();

        if (!oldObject)
            return Util.handleRequests(404, 'Gênero não encontrado.', null, callback);

        let newObject = new Genre(Util.parseJson(event.body));
        delete newObject._doc._id;

        Util.updateObject(oldObject, newObject._doc);

        yield oldObject.save();

        Util.handleRequests(200, 'Gênero alterado.', null, callback);

    }).catch((error) => {
        errorMapper.handle(error, callback);
    });
};
