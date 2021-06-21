const constant          = require(__basePath + '/app/config/constant');
const database          = require(constant.path.app + 'core/database');
const config            = require(constant.path.app + 'core/configuration')
const Utility           = require(constant.path.app + 'util/utility');

const SCHEMA            = config.DATABASE.INSTANCE_SCHEMA;
const TABLE             = 'resources';

exports.createResource  = (payload, callback) => {

    database.insert({
        table       : TABLE,
        records     : [
            {
                resourceId      : Utility.uuid(),
                title           : payload.title,
                description     : payload.description,
                blocks          : payload.blocks,
                tags            : payload.tags,
                slugUrl         : payload.title.split(' ').join('-') + '-' + Utility.uuid(),
                author          : payload.userId,
                show            : true
            }
        ]
    }, function(error, result) {
        if(error) {
            return callback(error);
        }
        console.log(result)
        return callback(null, result)
    })
}