const constant          = require(__basePath + '/app/config/constant');
const database          = require(constant.path.app + 'core/database');
const config            = require(constant.path.app + 'core/configuration')
const Utility           = require(constant.path.app + 'util/utility');

const SCHEMA            = config.DATABASE.INSTANCE_SCHEMA;
const RESOURCE_TABLE    = 'resources';
const USERS_TABLE       = 'users';
const BOOKMARK_TABLE    = 'bookmarks';

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
                'show'          : true,
                'approved'      : 0
            }
        ]
    }, function(error, result) {
        if(error) {
            return callback(error);
        }
        result          = {
            'message'   : "That's really great! Your resources has been submitted. To ensure the quality content to the community, our content team will review the resource and inform you."
        }
        return callback(null, result)
    })
}

exports.getResources    = (payload, callback) => {

    let userId          = payload['userId'];
    let bookmarkQuery   = '';
    if(userId) { 
        bookmarkQuery   = ', bookmark.bookmarkId';
    }
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
                user.userId,
                user.firstName,
                user.lastName,
                user.about,
                user.avatar
                ${bookmarkQuery}
        FROM ${SCHEMA}.${RESOURCE_TABLE} AS resource
        INNER JOIN ${SCHEMA}.${USERS_TABLE} AS user ON user.userId = resource.author
    `;

    // to check if user has book marked it already
    if(payload['userId']) {
        QUERY           += ` LEFT JOIN ${SCHEMA}.${BOOKMARK_TABLE} AS bookmark ON bookmark.resourceId = resource.resourceId AND bookmark.userId = "${payload.userId}"`;
    }  
    delete payload['userId'];

    // trend
    let trend           = payload.trend;
    if(payload['trend']) delete payload['trend'];

    let fields          = Object.keys(payload);

    fields.forEach((fieldName, fieldIndex) => {
        if(fieldIndex === 0) {
            QUERY       += ' WHERE ';
        } else {
            QUERY       += ' AND ';
        }
        QUERY           += `resource.${fieldName} = "${payload[fieldName]}"`
    });

    // only approved posts
    QUERY               += (fields.length > 0 ? ' AND ' : ' WHERE ') + ' resource.approved = 1';

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
            QUERY       += `ORDER BY resource.thanksCount DESC`;
            break;
    }

    if(payload.slugUrl) {
        QUERY           = `
            SELECT  *
            FROM ${SCHEMA}.${RESOURCE_TABLE} AS resource
            INNER JOIN ${SCHEMA}.${USERS_TABLE} AS user ON user.userId = resource.author
            WHERE resource.slugUrl  = "${payload.slugUrl}" AND resource.approved = 1
        `
    }
    database.query(QUERY, function(error, response) {
        if(error) {
            return callback(error);
        }
        return callback(null, response.data);
    })
}

exports.searchResources = (payload, callback) => {

    let search          = payload['search'];

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
                user.userId,
                user.firstName,
                user.lastName,
                user.about,
                user.avatar
        FROM ${SCHEMA}.${RESOURCE_TABLE} AS resource
        INNER JOIN ${SCHEMA}.${USERS_TABLE} AS user ON user.userId = resource.author
        WHERE resource.approved = 1 AND resource.title LIKE "%${search}%" OR resource.description LIKE "%${search}%"
    `;

    database.query(QUERY, function(error, response) {
        if(error) {
            return callback(error);
        }
        return callback(null, response.data);
    })
}

exports.updateResource   = (payload, callback) => {

    database.update({
        table       : RESOURCE_TABLE,
        records     : [
            payload
        ]
    }, function(error, result) {
        if(error) {
            return callback(error);
        }
        result          = {
            'message'   : "That's really great! Your resources has been updated.",
            'url'       : '/resource/' + payload.slugUrl
        }
        return callback(null, result)
    })

}

exports.updateCount     = (payload, callback) => {

    let QUERY           = '';

    if(payload.viewed) {
        QUERY           = `
            UPDATE ${SCHEMA}.${RESOURCE_TABLE}
            SET     viewsCount = viewsCount + 1
            WHERE   slugUrl  = "${payload.slugUrl}"
        `;
    } else {
        QUERY           = `
            UPDATE ${SCHEMA}.${RESOURCE_TABLE}
            SET     thanksCount = thanksCount + 1
            WHERE   slugUrl  = "${payload.slugUrl}"
        `;
    }

    database.query(QUERY, function(error, response) {
        if(error) {
            return callback(error);
        }
        return callback(null, response.data);
    })
}

exports.addBookmark     = (payload, callback) => {

    database.insert({
        table       : BOOKMARK_TABLE,
        records     : [
            {
                'bookmarkId'    : Utility.uuid(),
                'resourceId'    : payload.resourceId,
                'userId'        : payload.userId
            }
        ]
    }, function(error, result) {
        if(error) {
            return callback(error);
        }
        result          = {
            'message'   : "That's really great! Your resources has been bookmarked.",
        }
        return callback(null, result)
    })
}

exports.checkBookmark   = (payload, callback) => {

    let QUERY           = `
        SELECT * 
        FROM ${SCHEMA}.${BOOKMARK_TABLE}
        WHERE resourceId = "${payload.resourceId}" AND 
        userId  = "${payload.userId}"
    `;

    database.query(QUERY, function(error, response) {
        if(error) {
            return callback(error);
        }
        return callback(null, response.data);
    })
}

exports.getBookmarks    = (payload, callback) => {

    let QUERY           = `
        SELECT  resource.resourceId,
                resource.title,
                resource.__createdtime__,
                resource.thanksCount,
                resource.viewsCount,
                resource.resourceLevel,
                resource.resourceType,
                resource.slugUrl,
                bookmark.resourceId,
                bookmark.userId
        FROM ${SCHEMA}.${BOOKMARK_TABLE} AS bookmark
        LEFT JOIN ${SCHEMA}.${RESOURCE_TABLE} AS resource ON resource.resourceId = bookmark.resourceId
        WHERE userId = "${payload.userId}" 
    `;

    database.query(QUERY, function(error, response) {
        if(error) {
            return callback(error);
        }
        return callback(null, response.data);
    })
}

exports.searchByTag     = (payload, callback) => {

    let tagId           = payload['tagId'];

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
                user.userId,
                user.firstName,
                user.lastName,
                user.about,
                user.avatar
        FROM ${SCHEMA}.${RESOURCE_TABLE} AS resource
        INNER JOIN ${SCHEMA}.${USERS_TABLE} AS user ON user.userId = resource.author
        WHERE resource.approved = 1
    `;

    database.query(QUERY, function(error, response) {
        if(error) {
            return callback(error);
        }
        response.data = response.data.filter((resource) => {
            return resource.tags.indexOf(tagId) > -1;
        })
        return callback(null, response.data);
    })
}