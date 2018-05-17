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

        let oldProduction = yield Production.findById(event.pathParameters.id).exec();

        if (!oldProduction)
            return Util.handleRequests(404, 'Produção não encontrada.', null, callback);

        let payload = Util.parseJson(event.body);

        if (payload.image && !payload.image.startsWith(process.env.AWS_S3_BUCKET_URL)
            && (!payload.image.startsWith('data:') || payload.image.indexOf('base64,') === -1))
            return Util.handleRequests(400, 'Dados da imagem inválidos.', null, callback);

        let newProduction = new Production(payload);
        delete newProduction._doc._id;
        delete newProduction._doc.createdAt;
        delete newProduction._doc.updatedAt;
        delete newProduction._doc.createdBy;

        Util.updateObject(oldProduction, newProduction._doc);

        yield oldProduction.validate();

        if (newProduction.image && !newProduction.image.startsWith(process.env.AWS_S3_BUCKET_URL)) {
            let imageName = oldProduction._id.toString();

            yield S3.insert(newProduction.image, imageName);

            oldProduction.image = process.env.AWS_S3_BUCKET_URL + imageName;
        }

        yield oldProduction.save();

        Util.handleRequests(200, 'Produção alterada.', null, callback);
    }).catch((error) => {
        errorMapper.handle(error, callback);
    });
};
