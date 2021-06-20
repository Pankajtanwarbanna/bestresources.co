const constant          = require(__basePath + '/app/config/constant');
const config            = require(constant.path.app + 'core/configuration')
const jwtService        = require(constant.path.app + 'service/jwt.service');
const Utility           = require(constant.path.app + 'util/utility');

exports.createLink      = (payload, callback) => {
    const token         = jwtService.encode(payload, config.MAGIC_LINK_EXPIRY);
    
    if(!token) {
        return callback('Something broke!')
    }

    const email         = payload.email;
    const emailToken    = Utility.base64encode(email + config.MAGIC_LINK_SEPARATOR + token);
    const emailLink     = config.server.url + config.ROUTES.ACCOUNT_PAGE + '?token=' + emailToken;

    return callback(null, emailLink);
}

exports.verifyLink      = (token, callback) => {
    const tokenData     = Utility.base64decode(token);
    const data          = tokenData.split(config.MAGIC_LINK_SEPARATOR);

    if(data && data.length == 2) {
        const jwtToken  = data[1]; 
        const payload   = jwtService.decode(jwtToken);

        return callback(null, payload);
    }
    return callback('Invalid magic link.')
}