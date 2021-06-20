const jwt               = require('jsonwebtoken');
const constant          = require(__basePath + '/app/config/constant');
const config            = require(constant.path.app + 'core/configuration')
const secret            = config.SECRET;

exports.encode          = (data, expiry) => {
    try {
        return token    = jwt.sign(data, secret, { expiresIn : expiry });
    }
    catch(err) {
        return;
    }
};

exports.decode          = (token) => {
    try {
        return decoded  = jwt.verify(token, secret);
    }
    catch(err) {
        return;
    }
};
