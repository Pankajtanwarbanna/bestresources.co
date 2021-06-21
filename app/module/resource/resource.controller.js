const async                 = require("async");
const constant              = require(__basePath + '/app/config/constant');
const Response              = require(constant.path.app + 'util/response');
const errorHelper           = require(constant.path.app + 'util/errorHelper');
const resourceService       = require(constant.path.module + 'resource/resource.service');
const Utility               = require(constant.path.app + 'util/utility');

exports.new                 = (req, res) => {
    console.log(req.body)
    const createResource    = function(createResourceCallback) {
        const payload       = {
            'title'         : req.body.title,
            'description'   : req.body.description,
            'blocks'        : req.body.blocks,
            'tags'          : req.body.tags,
            'author'        : req.decoded.userId
        }
        resourceService.createResource(payload, function(error, resource) {
            if(error) {
                return createResourceCallback(error);
            } 
            return createResourceCallback(null, resource);
        });
    }

    async.waterfall([
        createResource    
    ], function (error, result) {
        if (error) {
            console.log(error)
            return res.status(400).json(Response.build('ERROR', 
                errorHelper.parseError(error) 
            ));   
        }
        return res.status(200).json(Response.build('SUCCESS', result ));
    });
}