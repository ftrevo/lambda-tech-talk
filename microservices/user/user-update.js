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

        if (event.requestContext.authorizer.role !== 'admin' &&
            event.requestContext.authorizer.user.toString() !== event.pathParameters.id)
            return Util.handleRequests(403, 'Forbidden', null, callback);

        let oldUser = yield User.findById(event.pathParameters.id).exec();

        if (!oldUser)
            return Util.handleRequests(404, 'Usuário não encontrada.', null, callback);

        let newUser = new User(Util.parseJson(event.body));
        delete newUser._doc._id;

        Util.updateObject(oldUser, newUser._doc);

        yield oldUser.save();

        Util.handleRequests(200, 'Usuário alterado.', null, callback);

    }).catch((error) => {
        errorMapper.handle(error, callback);
    });
};
