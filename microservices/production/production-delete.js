// --------------- Import de arquivos do core --------------- //
const co = require('lambda-techtalk-shared-libs').external.co;
const connection = require('lambda-techtalk-shared-libs').common.connection;
const errorMapper = require('lambda-techtalk-shared-libs').common.error;
const Production = require('lambda-techtalk-shared-libs').model.Production;
const Util = require('lambda-techtalk-shared-libs').common.util;
const S3 = require('lambda-techtalk-shared-libs').common.s3;

let conn = null;

module.exports.invoke = (event, context, callback) => {
    co(function* () {
        conn = yield connection.generateConn(conn, context);

        let oldProduction = yield Production.findOneAndRemove({ '_id': event.pathParameters.id }).exec();

        if (oldProduction && oldProduction.image)
            yield S3.remove(oldProduction._id.toString());

        Util.handleRequests(200, 'Produção removida.', null, callback);
    }).catch((error) => {
        errorMapper.handle(error, callback);
    });
};
