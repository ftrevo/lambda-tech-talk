// --------------- Import de arquivos do core --------------- //
const errorMapper = require('lambda-techtalk-shared-libs').common.error;
const Util = require('lambda-techtalk-shared-libs').common.util;
const Cast = require('lambda-techtalk-shared-libs').model.Cast;
const co = require('lambda-techtalk-shared-libs').external.co;

module.exports.create = (request, response) => {
    co(function* () {
        let newObject = new Cast(request.body);

        yield newObject.save();

        Util.handleRequestsExpress(201, 'Atriz/Ator criado(a).', response);
    }).catch((error) => {
        errorMapper.handleExpress(error, response);
    });
};

module.exports.read = (request, response) => {
    co(function* () {
        let params = request.query;

        let pagination = Util.resolvePagination(params);

        let list = yield Cast.find(params || {})
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
        let cast = yield Cast.findById(request.params.id);

        if (!cast)
            return Util.handleRequestsExpress(404, 'Atriz/Ator não encontrado(a).', response);

        return Util.handleRequestsExpress(200, cast, response);
    }).catch((error) => {
        errorMapper.handleExpress(error, response);
    });
};

module.exports.update = (request, response) => {
    co(function* () {
        let oldObject = yield Cast.findById(request.params.id).exec();

        if (!oldObject)
            return Util.handleRequestsExpress(404, 'Atriz/Ator não encontrado(a).', response);

        let newObject = new Cast(request.body);
        delete newObject._doc._id;

        Util.updateObject(oldObject, newObject._doc);

        yield oldObject.save();

        Util.handleRequestsExpress(200, 'Atriz/Ator alterado(a).', response);
    }).catch((error) => {
        errorMapper.handleExpress(error, response);
    });
};

module.exports.remove = (request, response) => {
    co(function* () {
        yield Cast.remove({ '_id': request.params.id });

        Util.handleRequestsExpress(200, 'Atriz/Ator removido(a).', response);
    }).catch((error) => {
        errorMapper.handleExpress(error, response);
    });
};

