// --------------- Import de dependências --------------- //
const jwt = require('jsonwebtoken');
const co = require('co');

// --------------- Import de arquivos do core --------------- //
const connection = require('../common').connection;
const errorMapper = require('../common').error;
const User = require('../model').User;

let conn = null;

module.exports.admininvoke = (event, context, callback) => {
    authorize(event, context, callback, 'admin');
};

module.exports.invoke = (event, context, callback) => {
    authorize(event, context, callback);
};

authorize = (event, context, callback, role) => {
    co(function* () {
        if (!event.authorizationToken)
            return callback(null, generatePolicy('Deny', event.methodArn, undefined));

        conn = yield connection.generateConn(conn, context);

        let token = event.authorizationToken.substring(4);

        const decoded = jwt.verify(token, process.env.APP_SECRET);

        let user = yield User.findById(decoded._id).exec();

        if (!user || (role && user.role.toLowerCase() !== role.toLowerCase()))
            return callback(null, generatePolicy('Deny', event.methodArn, undefined));

        callback(null, generatePolicy('Allow', event.methodArn, { 'user': user._id, 'role': user.role }));
    }).catch((error) => {
        errorMapper.handle(error, callback);
    });
};

module.exports.invokeCreateUserAdmin = (event, context, callback) => {
    co(function* () {
        if (!event.authorizationToken)
            return callback(null, generatePolicy('Allow', event.methodArn, { 'role': 'user' }));

        conn = yield connection.generateConn(conn, context);

        let token = event.authorizationToken.substring(4);

        const decoded = jwt.verify(token, process.env.APP_SECRET);

        let user = yield User.findById(decoded._id).exec();

        if (!user || (user.role.toLowerCase() !== 'admin'))
            return callback(null, generatePolicy('Allow', event.methodArn, { 'role': 'user' }));

        callback(null, generatePolicy('Allow', event.methodArn, { 'role': 'admin' }));
    }).catch((error) => {
        errorMapper.handle(error, callback);
    });
};

generatePolicy = (desiredEffect, desiredResource, contextData) => {
    let authResponse = {
        principalId: 'me',
        policyDocument: {
            Version: '2012-10-17',
            Statement: [
                {
                    Sid: 'ExecuteLambdas',
                    Action: 'execute-api:Invoke',
                    Effect: desiredEffect,
                    Resource: '*'
                },
                {
                    Sid: 'FullAccessToBucket',
                    Effect: desiredEffect,
                    Action: ['s3:*'],
                    Resource: `arn:aws:s3:::${process.env.AWS_S3_BUCKET_NAME}`
                }
            ]
        },
        context: contextData
    };

    return authResponse;
};