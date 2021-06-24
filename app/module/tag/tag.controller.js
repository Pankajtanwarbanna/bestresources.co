const async                 = require("async");
const constant              = require(__basePath + '/app/config/constant');
const config                = require(constant.path.app + 'core/configuration')
const Response              = require(constant.path.app + 'util/response');
const errorHelper           = require(constant.path.app + 'util/errorHelper');
const tagService            = require(constant.path.module + 'tag/tag.service');
const Utility               = require(constant.path.app + 'util/utility');

exports.new                 = (req, res) => {
    
    const payload           = {
        'tagId'             : Utility.uuid(),
        'author'            : req.decoded.userId,
        'avatar'            : config.DEFAULT_TAG_IMAGE,
        'rank'              : 0,
        'status'            : true,
        'slugUrl'           : Utility.generateSlugUrl(req.body.tag),
        'tag'               : req.body.tag.toLowerCase()
    }

    const createTag         = function(createTagCallback) {
        tagService.createTag(payload, function(error, tag) {
            if(error) {
                return createTagCallback(error);
            } 
            return createTagCallback(null, tag);
        });
    }

    async.waterfall([
        createTag
    ], function (error, result) {
        if (error) {
            return res.status(400).json(Response.build('ERROR', 
                errorHelper.parseError(error) 
            ));   
        }
        return res.status(200).json(Response.build('SUCCESS', result ));
    });
}

exports.get                 = (req, res) => {

    const getTags           = function(createTagCallback) {
        tagService.getTags({}, function(error, tags) {
            if(error) {
                return createTagCallback(error);
            } 
            return createTagCallback(null, tags);
        });
    }

    async.waterfall([
        getTags
    ], function (error, result) {
        if (error) {
            return res.status(400).json(Response.build('ERROR', 
                errorHelper.parseError(error) 
            ));   
        }
        return res.status(200).json(Response.build('SUCCESS', result ));
    });
}