const constant          = require(__basePath + '/app/config/constant');
const database          = require(constant.path.app + 'core/database');
const config            = require(constant.path.app + 'core/configuration')
const Utility           = require(constant.path.app + 'util/utility');

const SCHEMA            = config.DATABASE.INSTANCE_SCHEMA;
const RESOURCE_TABLE    = 'resources';
const USERS_TABLE       = 'users';

exports.createResource  = (payload, callback) => {

    database.insert({
        table       : RESOURCE_TABLE,
        records     : [
            {
                resourceId      : Utility.uuid(),
                title           : payload.title,
                description     : payload.description,
                blocks          : payload.blocks,
                tags            : payload.tags,
                slugUrl         : payload.title.split(' ').join('-') + '-' + Utility.uuid(),
                resourceLevel   : payload.resourceLevel,
                resourceType    : payload.resourceType,
                author          : payload.author,
                show            : true
            }
        ]
    }, function(error, result) {
        if(error) {
            return callback(error);
        }
        return callback(null, result)
    })
}

exports.getResources    = (payload, callback) => {

    //payload['show']     = true;
    let QUERY           = `
        SELECT  resource.resourceId,
                resource.title,
                resource.description,
                resource.blocks,
                resource.slugUrl,
                resource.tags,
                resource.__createdtime__,
                resource.__updatedtime__,
                user.firstName,
                user.lastName,
                user.about,
                user.twitter
        FROM ${SCHEMA}.${RESOURCE_TABLE} AS resource
        INNER JOIN ${SCHEMA}.${USERS_TABLE} AS user ON user.userId = resource.author
    `;
    
    Object.keys(payload).forEach((fieldName, fieldIndex) => {
        if(fieldIndex === 0) {
            QUERY       += ' WHERE ';
        } else {
            QUERY       += ' AND ';
        }
        QUERY           += `resource.${fieldName} = "${payload[fieldName]}"`
    })

    console.log(QUERY);

    database.query(QUERY, function(error, response) {
        if(error) {
            return callback(error);
        }
        return callback(null, response.data);
    })
}