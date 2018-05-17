// --------------- Import de arquivos do core --------------- //
const connection = require('lambda-techtalk-shared-libs').common.connection;
const errorMapper = require('lambda-techtalk-shared-libs').common.error;
const Genre = require('lambda-techtalk-shared-libs').model.Genre;
const Util = require('lambda-techtalk-shared-libs').common.util;
const co = require('lambda-techtalk-shared-libs').external.co;

module.exports.create = (request, response) => {
    co(function* () {
        let newObject = new Genre(request.body);

        yield newObject.save();

        Util.handleRequestsExpress(201, 'Gênero criado.', response);
    }).catch((error) => {
        errorMapper.handleExpress(error, response);
    });
};

module.exports.read = (request, response) => {
    co(function* () {
        let params = request.query;

        let pagination = Util.resolvePagination(params);

        let list = yield Genre.find(params || {})
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
        let genre = yield Genre.findById(request.params.id);

        if (!genre)
            return Util.handleRequestsExpress(404, 'Gênero não encontrado.', response);

        return Util.handleRequestsExpress(200, genre, response);
    }).catch((error) => {
        errorMapper.handleExpress(error, response);
    });
};

module.exports.update = (request, response) => {
    co(function* () {
        let oldObject = yield Genre.findById(request.params.id).exec();

        if (!oldObject)
            return Util.handleRequestsExpress(404, 'Gênero não encontrado.', response);

        let newObject = new Genre(request.body);
        delete newObject._doc._id;

        Util.updateObject(oldObject, newObject._doc);

        yield oldObject.save();

        Util.handleRequestsExpress(200, 'Gênero alterado.', response);
    }).catch((error) => {
        errorMapper.handleExpress(error, response);
    });
};

module.exports.remove = (request, response) => {
    co(function* () {
        yield Genre.remove({ '_id': request.params.id });

        Util.handleRequestsExpress(200, 'Gênero removido.', response);
    }).catch((error) => {
        errorMapper.handleExpress(error, response);
    });
};

