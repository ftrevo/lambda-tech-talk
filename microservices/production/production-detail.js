// --------------- Import de arquivos do core --------------- //
const co = require('lambda-techtalk-shared-libs').external.co;
const connection = require('lambda-techtalk-shared-libs').common.connection;
const errorMapper = require('lambda-techtalk-shared-libs').common.error;
const Production = require('lambda-techtalk-shared-libs').model.Production;
const Util = require('lambda-techtalk-shared-libs').common.util;

let conn = null;

module.exports.invoke = (event, context, callback) => {
    co(function* () {
        conn = yield connection.generateConn(conn, context);

        let production = yield Production.findById(event.pathParameters.id)
            .populate('audiovisualType genre cast createdBy', 'name').exec();

        if (!production)
            return Util.handleRequests(404, 'Produção não encontrada.', null, callback);

        Util.handleRequests(200, null, production, callback);
    }).catch((error) => {
        errorMapper.handle(error, callback);
    });
};
