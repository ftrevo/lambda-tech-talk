// --------------- Import de arquivos do core --------------- //
const connection = require('lambda-techtalk-shared-libs').common.connection;
const Production = require('lambda-techtalk-shared-libs').model.Production;
const errorMapper = require('lambda-techtalk-shared-libs').common.error;
const Util = require('lambda-techtalk-shared-libs').common.util;
const co = require('lambda-techtalk-shared-libs').external.co;
const S3 = require('lambda-techtalk-shared-libs').common.s3;

module.exports.create = (request, response) => {
    co(function* () {
        if (request.body.image &&
            (!request.body.image.startsWith('data:') || request.body.image.indexOf('base64,') === -1)) {
            return Util.handleRequestsExpress(400, 'Dados da imagem inválidos.', response);
        }

        let production = new Production(request.body);
        production.createdBy = request.user._id;

        yield production.validate();

        if (production.image) {
            let imageName = production._id.toString();

            yield S3.insert(production.image, imageName);

            production.image = process.env.AWS_S3_BUCKET_URL + imageName;
        }

        yield production.save();

        Util.handleRequestsExpress(201, 'Produção criada.', response);
    }).catch((error) => {
        errorMapper.handleExpress(error, response);
    });
};

module.exports.read = (request, response) => {
    co(function* () {
        let params = request.query;

        let pagination = Util.resolvePagination(params);

        let list = yield Production.find(params || {})
            .skip(pagination.skip)
            .limit(pagination.max)
            .sort({ 'createdAt': 1 })
            .populate('audiovisualType genre cast createdBy', 'name')
            .exec();

        Util.handleRequestsExpress(200, list, response);
    }).catch((error) => {
        errorMapper.handleExpress(error, response);
    });
};

module.exports.detail = (request, response) => {
    co(function* () {
        let production = yield Production.findById(request.params.id)
            .populate('audiovisualType genre cast createdBy', 'name').exec();

        if (!production)
            return Util.handleRequestsExpress(404, 'Produção não encontrada.', response);

        return Util.handleRequestsExpress(200, production, response);
    }).catch((error) => {
        errorMapper.handleExpress(error, response);
    });
};

module.exports.update = (request, response) => {
    co(function* () {
        let oldObject = yield Production.findById(request.params.id).exec();

        if (!oldProduction)
            return Util.handleRequestsExpress(404, 'Produção não encontrada.', response);

        let payload = request.body;

        if (payload.image && !payload.image.startsWith(process.env.AWS_S3_BUCKET_URL)
            && (!payload.image.startsWith('data:') || payload.image.indexOf('base64,') === -1))
            return Util.handleRequestsExpress(400, 'Dados da imagem inválidos.', response);

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

        Util.handleRequestsExpress(200, 'Produção alterada.', response);
    }).catch((error) => {
        errorMapper.handleExpress(error, response);
    });
};

module.exports.remove = (request, response) => {
    co(function* () {
        let oldProduction = yield Production.findOneAndRemove({ '_id': request.params.id }).exec();

        if (oldProduction && oldProduction.image)
            yield S3.remove(oldProduction._id.toString());

        Util.handleRequestsExpress(200, 'Produção removida.', response);
    }).catch((error) => {
        errorMapper.handleExpress(error, response);
    });
};

