// --------------- Import de arquivos do core --------------- //
const co = require('lambda-techtalk-shared-libs').external.co;
const connection = require('lambda-techtalk-shared-libs').common.connection;
const errorMapper = require('lambda-techtalk-shared-libs').common.error;
const User = require('lambda-techtalk-shared-libs').model.User;
const Util = require('lambda-techtalk-shared-libs').common.util;

let conn = null;

module.exports.invoke = (event, context, callback) => {
    co(function* () {
        conn = yield connection.generateConn(conn, context);

        let params = Util.parseJson(JSON.stringify(event.queryStringParameters));

        let pagination = Util.resolvePagination(params);

        let list = yield User.find(params || {}, { password: 0 })
            .skip(pagination.skip)
            .limit(pagination.max)
            .sort({ 'name': 1 })
            .exec();

        Util.handleRequests(200, null, list, callback);

    }).catch((error) => {
        errorMapper.handle(error, callback);
    });
};
