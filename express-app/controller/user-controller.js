// --------------- Import de arquivos do core --------------- //
const co = require('lambda-techtalk-shared-libs').external.co;
const jwt = require('lambda-techtalk-shared-libs').external.jsonwebtoken;
const connection = require('lambda-techtalk-shared-libs').common.connection;
const errorMapper = require('lambda-techtalk-shared-libs').common.error;
const User = require('lambda-techtalk-shared-libs').model.User;
const Util = require('lambda-techtalk-shared-libs').common.util;

module.exports.login = (request, response) => {
    co(function* () {
        let { email, password } = request.body;

        if (!email || !password) return Util.handleRequestsExpress(400, 'Dados inválidos.', response);

        let user = yield User.findOne({ 'email': email }).exec();

        if (!user) return Util.handleRequestsExpress(404, 'Usuário não encontrado.', response);

        let passwordMatch = yield user.comparePassword(password);

        if (!passwordMatch) return Util.handleRequestsExpress(401, 'Senha inválida.', response);

        user = user.toObject();
        delete user.password;

        let token = jwt.sign(user, process.env.APP_SECRET, { expiresIn: '30 days' });

        Util.handleRequestsExpress(200, { token: 'JWT ' + token }, response);
    }).catch((error) => {
        errorMapper.handleExpress(error, response);
    });
};

module.exports.createAdmin = (request, response) => {
    invokeCreate(request, response, 'admin');
};

module.exports.createUser = (request, response) => {
    invokeCreate(request, response, 'user');
};

invokeCreate = (request, response, role) => {
    co(function* () {
        let user = new User(request.body);
        user.role = role;

        yield user.save();

        user = user.toObject();
        delete user.password;

        let token = jwt.sign(user, process.env.APP_SECRET, { expiresIn: '30 days' });

        Util.handleRequestsExpress(201, { message: 'Usuário criado.', token: 'JWT ' + token }, response);
    }).catch((error) => {
        errorMapper.handleExpress(error, response);
    });
};

module.exports.update = (request, response) => {
    co(function* () {
        if (request.user.role.toLowerCase() !== 'admin' &&
            request.user_id.toString() !== request.params.id)
            return Util.handleRequestsExpress(403, 'Forbidden', response);

        let oldUser = yield User.findById(request.params.id).exec();

        if (!oldUser)
            return Util.handleRequestsExpress(404, 'Usuário não encontrada.', response);

        let newUser = new User(request.body);
        delete newUser._doc._id;

        Util.updateObject(oldUser, newUser._doc);

        yield oldUser.save();

        Util.handleRequestsExpress(200, 'Usuário alterado.', response);

    }).catch((error) => {
        errorMapper.handleExpress(error, response);
    });
};

module.exports.read = (request, response) => {
    co(function* () {
        let params = request.query;

        let pagination = Util.resolvePagination(params);

        let list = yield User.find(params || {}, { password: 0 })
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
        if (request.user.role.toLowerCase() !== 'admin' &&
            request.user._id.toString() !== request.params.id)
            return Util.handleRequestsExpress(403, 'Forbidden', response);

        let user = yield User.findById(request.params.id, { password: 0 }).exec();

        if (!user)
            return Util.handleRequestsExpress(404, 'Usuário não encontrado.', response);

        return Util.handleRequestsExpress(200, user, response);
    }).catch((error) => {
        errorMapper.handleExpress(error, response);
    });
};

module.exports.remove = (request, response) => {
    co(function* () {
        yield User.remove({ '_id': request.params.id }).exec();

        Util.handleRequestsExpress(200, 'Usuário removido.', response);
    }).catch((error) => {
        errorMapper.handleExpress(error, response);
    });
};
