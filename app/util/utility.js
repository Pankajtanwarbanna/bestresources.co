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

exports.generateSlugUrl     = (title) => {
    return (title.toLowerCase()).trim().replace(/ /g,'-').replace(/[^a-zA-Z0-9]+/g,'-');
}

exports.shortId             = () => {
    return Math.floor(Date.now() / 1000).toString(36);
}