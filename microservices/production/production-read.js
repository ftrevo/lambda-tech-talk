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

        let params = Util.parseJson(JSON.stringify(event.queryStringParameters));

        let pagination = Util.resolvePagination(params);

        let list = yield Production.find(params || {})
            .skip(pagination.skip)
            .limit(pagination.max)
            .sort({ 'createdAt': 1 })
            .populate('audiovisualType genre cast createdBy', 'name')
            .exec();

        Util.handleRequests(200, null, list, callback);
    }).catch((error) => {
        errorMapper.handle(error, callback);
    });
};
