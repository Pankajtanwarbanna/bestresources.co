const constant          = require(__basePath + '/app/config/constant');
const database          = require(constant.path.app + 'core/database');
const config            = require(constant.path.app + 'core/configuration')
const Utility           = require(constant.path.app + 'util/utility');
const jwtService        = require(constant.path.app + 'service/jwt.service');

const SCHEMA            = config.DATABASE.INSTANCE_SCHEMA;
const TABLE             = 'users';

exports.findUser        = (payload, callback) => {

    let QUERY           = `
        SELECT * 
        FROM ${SCHEMA}.${TABLE}
        WHERE
    `;

    Object.keys(payload).forEach((fieldName, fieldIndex) => {
        if(fieldIndex !== 0) QUERY += ' AND ';
        QUERY           += `${fieldName} = "${payload[fieldName]}"`
    })

    database.query(QUERY, function(error, response) {
        if(error) {
            return callback(error);
        }
        return callback(null, response.data);
    })
}

exports.updateCount     = (payload, callback) => {

    let QUERY           = '';

    if(payload.resource) {
        QUERY           = `
            UPDATE ${SCHEMA}.${TABLE}
            SET     totalResource = totalResource + 1
            WHERE   userId  = "${payload.userId}"
        `;
    } else {
        QUERY           = `
            UPDATE ${SCHEMA}.${TABLE}
            SET     totalThanks = totalThanks + 1
            WHERE   userId  = "${payload.userId}"
        `;
    }
    database.query(QUERY, function(error, response) {
        if(error) {
            return callback(error);
        }
        return callback(null, response.data);
    })
}

exports.createUser      = (payload, callback) => {

    database.insert({
        table       : TABLE,
        records     : [
            {
                userId          : Utility.uuid(),
                email           : payload.email,
                firstName       : payload.email.split('@')[0] || 'Guest',
                lastName        : payload.lastName  || '',
                about           : payload.about || "",
                avatar          : config.DEFAULT_AVATAR_LINK,
                twitter         : payload.twitter || "",
                linkedin        : payload.linkedin || "",
                website         : payload.website || "",
                youtube         : payload.youtube || "",
                totalResource   : 0,
                totalThanks     : 0,
                verified        : false
            }
        ]
    }, function(error, result) {
        if(error) {
            return callback(error);
        }
        result          = [{
            'userId'    : result.data.inserted_hashes[0] 
        }]
        return callback(null, result)
    })
}

exports.updateUser      = (payload, callback) => {

    database.update({
        table       : TABLE,
        records     : [
            payload
        ]
    }, function(error, result) {
        if(error) {
            return callback(error);
        }
        return callback(null, result)
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