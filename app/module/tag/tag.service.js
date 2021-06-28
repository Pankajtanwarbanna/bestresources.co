const constant          = require(__basePath + '/app/config/constant');
const database          = require(constant.path.app + 'core/database');
const config            = require(constant.path.app + 'core/configuration')
const Utility           = require(constant.path.app + 'util/utility');

const SCHEMA            = config.DATABASE.INSTANCE_SCHEMA;
const TABLE             = 'tags';

exports.createTag       = (payload, callback) => {

    database.insert({
        table       : TABLE,
        records     : [
            payload
        ]
    }, function(error, result) {
        if(error) {
            return callback(error);
        }
        result  = {
            'message' : "Yay. Tag successfully added."
        }
        return callback(null, result)
    })
}

exports.getTags         = (payload, callback) => {

    let slugUrl         = payload['slugUrl'];
    let slugQuery       = '';
    
    if(slugUrl) slugQuery =  `WHERE slugUrl = '${slugUrl}'`;

    let QUERY           = `
        SELECT tag, avatar, slugUrl, tagId 
        FROM ${SCHEMA}.${TABLE}
        ${slugQuery}
        ORDER BY rank DESC
    `;

    database.query(QUERY, function(error, response) {
        if(error) {
            return callback(error);
        }
        return callback(null, response.data);
    })
}