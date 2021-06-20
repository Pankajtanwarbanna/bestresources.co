const constant          = require(__basePath + '/app/config/constant');
const database          = require(constant.path.app + 'core/database');
const config            = require(constant.path.app + 'core/configuration')
const Utility           = require(constant.path.app + 'util/utility');
const jwtService        = require(constant.path.app + 'service/jwt.service');
const SCHEMA            = config.DATABASE.INSTANCE_SCHEMA;
const TABLE             = 'users';

exports.findUser        = (payload, callback) => {

    const email         = payload.email;

    const QUERY         = `
        SELECT * 
        FROM ${SCHEMA}.${TABLE}
        WHERE
        email = "${email}"
    `;

    database.query(QUERY, function(error, response) {
        if(error) {
            return callback(error);
        }
        callback(null, response.data);
    })
}

exports.createUser      = (payload, callback) => {

    database.insert({
        table       : TABLE,
        records     : [
            {
                userId          : Utility.uuid(),
                email           : payload.email,
                firstName       : payload.firstName || 'Guest',
                lastName        : payload.lastName  || 'User',
                about           : payload.about,
                avatar          : 'http://localhost:8080/assets/images/icon/default-user.webp',
                twitter         : payload.twitter,
                linkedin        : payload.linkedin,
                website         : payload.website,
                youtube         : payload.youtube,
                verified        : false
            }
        ]
    }, function(error, result) {
        if(error) {
            return callback(error);
        }
        callback(null, result)
    })
}

exports.generateAuth    = (userInfo, callback) => {
    const payload       = {
        'userId'        : userInfo.userId
    }

    const auth          = jwtService.encode(payload, config.AUTH_TOKEN_EXPIRY);
    if(!auth) return callback('Something went wrong!')
    
    return callback(null, { auth });
}