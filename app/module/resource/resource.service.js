const constant          = require(__basePath + '/app/config/constant');
const database          = require(constant.path.app + 'core/database');
const config            = require(constant.path.app + 'core/configuration')
const Utility           = require(constant.path.app + 'util/utility');

const SCHEMA            = config.DATABASE.INSTANCE_SCHEMA;
const RESOURCE_TABLE    = 'resources';
const USERS_TABLE       = 'users';

exports.createResource  = (payload, callback) => {

    let slugUrl         = Utility.generateSlugUrl(payload.title) + '-' + Utility.shortId();
    database.insert({
        table       : RESOURCE_TABLE,
        records     : [
            {
                'resourceId'    : Utility.uuid(),
                'title'         : payload.title.trim(),
                'description'   : payload.description.trim(),
                'blocks'        : payload.blocks,
                'tags'          : payload.tags,
                'resourceType'  : payload.resourceType,
                'resourceLevel' : payload.resourceLevel,
                'views'         : {},
                'viewsCount'    : 0,
                'thanks'        : {},
                'thanksCount'   : 0,
                'blocksCount'   : Object.keys(payload.blocks).length,    
                'slugUrl'       : slugUrl,
                'author'        : payload.author,
                'show'          : true
            }
        ]
    }, function(error, result) {
        if(error) {
            return callback(error);
        }
        result          = {
            'message'   : "That's really great! Your resources has been published.",
            'url'       : '/resource/' + slugUrl
        }
        return callback(null, result)
    })
}

exports.getResources    = (payload, callback) => {

    let QUERY           = `
        SELECT  resource.resourceId,
                resource.title,
                resource.description,
                resource.slugUrl,
                resource.tags,
                resource.thanksCount,
                resource.viewsCount,
                resource.blocksCount,
                resource.resourceLevel,
                resource.resourceType,
                resource.__createdtime__,
                resource.__updatedtime__,
                user.firstName,
                user.lastName,
                user.about,
                user.avatar
        FROM ${SCHEMA}.${RESOURCE_TABLE} AS resource
        INNER JOIN ${SCHEMA}.${USERS_TABLE} AS user ON user.userId = resource.author
    `;

    let trend           = payload.trend;
    switch(trend) {
        case 'intresting':
            QUERY       += `ORDER BY resource.thanksCount DESC`;
            break;
        case 'hot':
            QUERY       += `ORDER BY resource.thanksCount DESC, resource.viewsCount DESC, resource.blocksCount DESC`;
            break;
        case 'recent':
            QUERY       += `ORDER BY resource.__createdtime__ DESC`;
            break;
        default:
            QUERY  .getResources     += `ORDER BY resource.thanksCount DESC`;
            break;
    }
    
    if(payload['trend']) delete payload['trend'];

    Object.keys(payload).forEach((fieldName, fieldIndex) => {
        if(fieldIndex === 0) {
            QUERY       += ' WHERE ';
        } else {
            QUERY       += ' AND ';
        }
        QUERY           += `resource.${fieldName} = "${payload[fieldName]}"`
    })

    database.query(QUERY, function(error, response) {
        if(error) {
            return callback(error);
        }
        return callback(null, response.data);
    })
}