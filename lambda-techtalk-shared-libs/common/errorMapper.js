// --------------- Import de arquivos do core --------------- //
const Util = require('./util');
const mongooseErrors = require('mongoose').Error;

module.exports.handle = (error, callback) => {
    let knownError = knownErrors(error);

    if (knownError) {
        return Util.handleRequests(knownError.code, knownError.messageObject, null, callback);
    }

    console.log(JSON.stringify(error));
    console.log(JSON.stringify(error.message));
    console.log(JSON.stringify(error.stack));
    console.error(JSON.stringify(error));
    console.error(JSON.stringify(error.message));
    console.error(JSON.stringify(error.stack));
    Util.handleRequests(500, 'Internal Server Error.', null, callback);
};

module.exports.handleExpress = (error, response) => {
    let knownError = knownErrors(error);

    if (knownError) {
        return Util.handleRequestsExpress(knownError.code, { message: knownError.messageObject }, response);
    }

    console.log(JSON.stringify(error.message));
    console.log(JSON.stringify(error.stack));
    console.error(JSON.stringify(error.message));
    console.error(JSON.stringify(error.stack));
    Util.handleRequestsExpress(500, 'Internal Server Error.', response);
};

function knownErrors(error) {
    if (error instanceof mongooseErrors.ValidationError) {
        let errorStack = [];

        for (let errorField in error.errors) {
            if (error.errors[errorField] instanceof mongooseErrors.CastError) {
                errorStack.push(`Dados inválidos para o campo ${Util.translatePath(error.errors[errorField])}`);
            } else if (error.errors[errorField] instanceof mongooseErrors.ValidatorError &&
                error.errors[errorField].message === 'MISSING-OBJECT') {
                errorStack.push(`O campo ${Util.translatePath(errorField)} referencia um objeto que não existe.`);
            } else {
                errorStack.push(error.errors[errorField].message);
            }
        };

        return {
            code: 400,
            messageObject: errorStack
        };
    }

    if (error.name === 'ObjectParameterError' || error instanceof mongooseErrors.CastError) {
        return {
            code: 400,
            messageObject: 'Dados inválidos.'
        };
    }

    if (error.message === 'Forbidden') {
        return {
            code: 403,
            messageObject: 'Forbidden'
        };
    }
}
