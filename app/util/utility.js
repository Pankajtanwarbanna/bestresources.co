const uuid                  = require('uuid').v4;

exports.isEmpty             = (data) => {
    if(!data) return true;
    if(data.length === 0) return true;
    return false;
}

exports.uuid                = ()    => {
    return uuid();
}

exports.base64encode        = (token) => {
    return Buffer.from(token.toString()).toString('base64');
}

exports.base64decode        = (token) => {
    return Buffer.from(token.toString(), 'base64').toString('ascii');
}