const async                 = require("async");
const constant              = require(__basePath + '/app/config/constant');
const Response              = require(constant.path.app + 'util/response');
const errorHelper           = require(constant.path.app + 'util/errorHelper');
const resourceService       = require(constant.path.module + 'resource/resource.service');
const userService           = require(constant.path.module + 'user/user.service');
const Utility               = require(constant.path.app + 'util/utility');

exports.new                 = (req, res) => {

    const createResource    = function(createResourceCallback) {
        const payload       = {
            'author'        : req.decoded.userId,
            ...req.body
        }
        resourceService.createResource(payload, function(error, resource) {
            if(error) {
                return createResourceCallback(error);
            } 
            return createResourceCallback(null, resource);
        });
    }

    const updateUser        = function(resource, updateUserCallback) {
        const payload       = {
            'userId'        : req.decoded.userId,
            'resource'      : true
        }

        userService.updateCount(payload, function(error, result) {
            if(error) {
                return updateUserCallback(error);
            }
            return updateUserCallback(null, resource);
        })
    }

    async.waterfall([
        createResource,
        updateUser    
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
    
    let trend               = req.query.trend || 'intresting';
    const getResources      = function(getResourcesCallback) {
        const payload       = {
            trend           : trend
        };

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
            slugUrl         : req.params.slugUrl
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