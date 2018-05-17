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

        let payload = Util.parseJson(event.body);

        if (payload.image && (!payload.image.startsWith('data:') || payload.image.indexOf('base64,') === -1)) {
            return Util.handleRequests(400, 'Dados da imagem inválidos.', null, callback);
        }

        let production = new Production(payload);
        production.createdBy = event.requestContext.authorizer.user;

        yield production.validate();

        if (production.image) {
            let imageName = production._id.toString();

            yield S3.insert(production.image, imageName);

            production.image = process.env.AWS_S3_BUCKET_URL + imageName;
        }

        yield production.save();

        Util.handleRequests(201, 'Produção criada.', null, callback);
    }).catch((error) => {
        errorMapper.handle(error, callback);
    });
};
