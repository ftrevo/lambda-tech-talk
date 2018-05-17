// --------------- Import de arquivos do core --------------- //
const AudiovisualType = require('lambda-techtalk-shared-libs').model.AudiovisualType;
const errorMapper = require('lambda-techtalk-shared-libs').common.error;
const Util = require('lambda-techtalk-shared-libs').common.util;
const co = require('lambda-techtalk-shared-libs').external.co;

module.exports.create = (request, response) => {
    co(function* () {
        let newObject = new AudiovisualType(request.body);

        yield newObject.save();

        Util.handleRequestsExpress(201, 'Tipo de Produção Audiovisual criada.', response);
    }).catch((error) => {
        errorMapper.handleExpress(error, response);
    });
};

module.exports.read = (request, response) => {
    co(function* () {
        let params = request.query;

        let pagination = Util.resolvePagination(params);

        let list = yield AudiovisualType.find(params || {})
            .skip(pagination.skip)
            .limit(pagination.max)
            .sort({ 'name': 1 })
            .exec();

        Util.handleRequestsExpress(200, list, response);
    }).catch((error) => {
        errorMapper.handleExpress(error, response);
    });
};

module.exports.detail = (request, response) => {
    co(function* () {
        let audiovisualType = yield AudiovisualType.findById(request.params.id);

        if (!audiovisualType)
            return Util.handleRequestsExpress(404, 'Tipo de Produção Audiovisual não encontrado.', response);

        Util.handleRequestsExpress(200, audiovisualType, response);
    }).catch((error) => {
        errorMapper.handleExpress(error, response);
    });
};

module.exports.update = (request, response) => {
    co(function* () {
        let oldObject = yield AudiovisualType.findById(request.params.id).exec();

        if (!oldObject)
            return Util.handleRequestsExpress(404, 'Tipo de Produção Audiovisual não encontrado.', response);

        let newObject = new AudiovisualType(request.body);
        delete newObject._doc._id;

        Util.updateObject(oldObject, newObject._doc);

        yield oldObject.save();

        Util.handleRequestsExpress(200, 'Tipo de Produção Audiovisual alterada.', response);
    }).catch((error) => {
        errorMapper.handleExpress(error, response);
    });
};

module.exports.remove = (request, response) => {
    co(function* () {
        yield AudiovisualType.remove({ '_id': request.params.id }).exec();

        Util.handleRequestsExpress(200, 'Tipo de Produção Audiovisual removida.', response);
    }).catch((error) => {
        errorMapper.handleExpress(error, response);
    });
};

