const async                 = require("async");
const constant              = require(__basePath + '/app/config/constant');
const Response              = require(constant.path.app + 'util/response');
const errorHelper           = require(constant.path.app + 'util/errorHelper');
const resourceService       = require(constant.path.module + 'resource/resource.service');
const Utility               = require(constant.path.app + 'util/utility');

exports.new                 = (req, res) => {

    const createResource    = function(createResourceCallback) {
        const payload       = {
            'title'         : req.body.title,
            'description'   : req.body.description,
            'blocks'        : req.body.blocks,
            'tags'          : req.body.tags,
            'resourceType'  : req.body.resourceType,
            'resourceLevel' : req.body.resourceLevel,
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
            return res.status(400).json(Response.build('ERROR', 
                errorHelper.parseError(error) 
            ));   
        }
        return res.status(200).json(Response.build('SUCCESS', result ));
    });
}

exports.get                 = (req, res) => {
    
    const getResources      = function(getResourcesCallback) {
        const payload       = {};

        resourceService.getResources(payload, function(error, resource) {
            if(error) {
                return getResourcesCallback(error);
            } 
            return getResourcesCallback(null, resource);
        });
    }

    async.waterfall([
        getResources    
    ], function (error, result) {
        if (error) {
            return res.status(400).json(Response.build('ERROR', 
                errorHelper.parseError(error) 
            ));   
        }
        return res.status(200).json(Response.build('SUCCESS', result ));
    });
}

exports.getResource         = (req, res) => {

    const getResources      = function(getResourcesCallback) {
        const payload       = {
            resourceId      : req.params.resourceId
        }
        resourceService.getResources(payload, function(error, resource) {
            if(error) {
                return getResourcesCallback(error);
            } 
            return getResourcesCallback(null, resource);
        });
    }

    async.waterfall([
        getResources    
    ], function (error, result) {
        if (error) {
            return res.status(400).json(Response.build('ERROR', 
                errorHelper.parseError(error) 
            ));   
        }
        return res.status(200).json(Response.build('SUCCESS', result ));
    });
}