let regexEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

module.exports.parseJson = (jsonString) => {
    try {
        let something = JSON.parse(jsonString);

        if (something && typeof something === 'object') {
            return something;
        }
    }
    catch (e) {
        // Try - Catch do Mudinho!
        console.error(e);
    }

    return false;
};

module.exports.handleRequests = (stausCodeNumber, messageObject, bodyObject, callback) => {
    let bodydata = bodyObject || { message: messageObject };
    let response = {
        statusCode: stausCodeNumber,
        body: JSON.stringify(bodydata),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
            'Access-Control-Allow-Methods': 'DELETE,GET,HEAD,OPTIONS,PATCH,POST,PUT',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
        }
    }
    return callback(null, response);
}

module.exports.handleRequestsExpress = (stausCodeNumber, bodyOrMessage, response) => {
    let bodydata;

    if(typeof bodyOrMessage === 'string' || bodyOrMessage instanceof String){
        bodydata = { message: bodyOrMessage };
    } else {
        bodydata = bodyOrMessage;
    }

    return response.status(stausCodeNumber).send(bodydata);
};


module.exports.validEmail = (email) => {
    return regexEmail.test(email);
};

module.exports.resolvePagination = (params) => {
    let page = parseInt(params.page) || 0;
    let limit = parseInt(params.limit) || 99999;

    return { 'skip': page * limit, 'max': limit }
}

module.exports.updateObject = (oldObject, newObject) => {
    Object.keys(newObject).forEach((key) => {
        oldObject[key] = newObject[key];
    });
}

module.exports.translatePath = (someObjectPath) => {
    switch (someObjectPath) {
        case 'audiovisualType': return 'Tipo de Produção Audiovisual';
        case 'genre': return 'Gênero';
        case 'cast': return 'Atriz/Ator';
        case 'createdBy': return 'Usuário de Criação';
        case 'image': return 'Imagem';
        default: return '';
    }
}

module.exports.matchIgnoreCase = (pattern, stringToTest) => {
    let regexToTest = new RegExp(pattern, 'i');
    return regexToTest.test(stringToTest);
}