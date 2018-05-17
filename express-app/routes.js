// --------------- Import de dependências --------------- //
const passport = require('passport');

// --------------- Import de arquivos do core --------------- //
const Util = require('lambda-techtalk-shared-libs').common.util;
const RoleAuthorization = require('./helpers/role-authorization');

// --------------- Import de controllers --------------- //
const AudioVisualTypeController = require('./controller/audiovisual-type-controller');
const GenreController = require('./controller/genre-controller');
const UserController = require('./controller/user-controller');
const CastController = require('./controller/cast-controller');
const ProductionController = require('./controller/production-controller');

module.exports = (app) => {
    app.get('/', (request, response, next) => {
        Util.handleRequestsExpress(200, new Date(), response);
    });

    app.get('/audiovisual-types', AudioVisualTypeController.read);
    app.get('/audiovisual-types/:id', AudioVisualTypeController.detail);
    app.post('/audiovisual-types', passport.authenticate('jwt', { session: false }), RoleAuthorization('ADMIN'), AudioVisualTypeController.create);
    app.put('/audiovisual-types/:id', passport.authenticate('jwt', { session: false }), RoleAuthorization('ADMIN'), AudioVisualTypeController.update);
    app.delete('/audiovisual-types/:id', passport.authenticate('jwt', { session: false }), RoleAuthorization('ADMIN'), AudioVisualTypeController.remove);

    app.post('/users/login', UserController.login);
    app.post('/users/admin', passport.authenticate('jwt', { session: false }), RoleAuthorization('ADMIN'), UserController.createAdmin);
    app.post('/users', UserController.createUser);
    app.put('/users/:id', passport.authenticate('jwt', { session: false }), RoleAuthorization('ADMIN', 'USER'), UserController.update);
    app.get('/users',passport.authenticate('jwt', { session: false }), RoleAuthorization('ADMIN'), UserController.read);
    app.get('/users/:id',passport.authenticate('jwt', { session: false }), RoleAuthorization('ADMIN', 'USER'), UserController.detail);
    app.delete('/users/:id', passport.authenticate('jwt', { session: false }), RoleAuthorization('ADMIN'), UserController.remove);

    app.get('/genres', GenreController.read);
    app.get('/genres/:id', GenreController.detail);
    app.post('/genres', passport.authenticate('jwt', { session: false }), RoleAuthorization('ADMIN'), GenreController.create);
    app.put('/genres/:id', passport.authenticate('jwt', { session: false }), RoleAuthorization('ADMIN'), GenreController.update);
    app.delete('/genres/:id', passport.authenticate('jwt', { session: false }), RoleAuthorization('ADMIN'), GenreController.remove);

    app.get('/casts', CastController.read);
    app.get('/casts/:id', CastController.detail);
    app.post('/casts', passport.authenticate('jwt', { session: false }), RoleAuthorization('ADMIN'), CastController.create);
    app.put('/casts/:id', passport.authenticate('jwt', { session: false }), RoleAuthorization('ADMIN'), CastController.update);
    app.delete('/casts/:id', passport.authenticate('jwt', { session: false }), RoleAuthorization('ADMIN'), CastController.remove);

    app.get('/productions', ProductionController.read);
    app.get('/productions/:id', ProductionController.detail);
    app.post('/productions', passport.authenticate('jwt', { session: false }), RoleAuthorization('ADMIN'), ProductionController.create);
    app.put('/productions/:id', passport.authenticate('jwt', { session: false }), RoleAuthorization('ADMIN'), ProductionController.update);
    app.delete('/productions/:id', passport.authenticate('jwt', { session: false }), RoleAuthorization('ADMIN'), ProductionController.remove);

};
