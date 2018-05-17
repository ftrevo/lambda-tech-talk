require('env-yaml').config({ path: './node_modules/lambda-techtalk-shared-libs/env.yml' });

// --------------- Import de dependências --------------- //
const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport');
const express = require('express');

// --------------- Import de arquivos do core --------------- //
const errorMapperHandler = require('lambda-techtalk-shared-libs').common.error.handleExpress;
const connection = require('lambda-techtalk-shared-libs').common.connection;
const Util = require('lambda-techtalk-shared-libs').common.util;
const co = require('lambda-techtalk-shared-libs').external.co;
const routes = require('./routes');

const app = express();
app.use(bodyParser.json());

//Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
require('./helpers/passport')(passport);

let conn;

// Connection Middleware
app.use((request, response, next) => {
    co(function* () {
        conn = yield connection.generateConn(conn, request);
        next();
    }).catch((error) => {
        errorMapperHandler(error, response);
    });
});

routes(app);

//Not Found Middleware
app.use((request, response, next) => {
    Util.handleRequestsExpress(404, 'Not Found', response);
});

app.use(errorMapperHandler);

module.exports.handler = serverless(app);

