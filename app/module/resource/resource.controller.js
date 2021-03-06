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
        if(req.query.search) {
            const payload       = {
                search          : req.query.search,
                userId          : req.decoded ? req.decoded.userId : null
            };
    
            resourceService.searchResources(payload, function(error, resource) {
                if(error) {
                    return getResourcesCallback(error);
                } 
                return getResourcesCallback(null, resource);
            });
        } else {
            const payload       = {
                trend           : trend,
                userId          : req.decoded ? req.decoded.userId : null
            };
    
            resourceService.getResources(payload, function(error, resource) {
                if(error) {
                    return getResourcesCallback(error);
                } 
                return getResourcesCallback(null, resource);
            });
        }
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

    const markViewed        = function(resource, markViewedCallback) {
        const payload       = {
            slugUrl         : req.params.slugUrl,
            viewed          : true
        };

        resourceService.updateCount(payload, function(error, result) {
            if(error) {
                return markViewedCallback(error);
            } 
            return markViewedCallback(null, resource);
        });
    }

    const checkBookmark     = function(resource, checkBookmarkCallback) {
        const payload       = {
            resourceId      : resource[0] ? resource[0].resourceId : null,
            userId          : req.decoded ? req.decoded.userId : null
        }

        if(payload["userId"] && payload["resourceId"]) {
            resourceService.checkBookmark(payload, function(error, result) {
                if(error) {
                    return checkBookmarkCallback(null, resource);
                } 
                if(result.length > 0) resource[0].bookmarked   = true;
                return checkBookmarkCallback(null, resource);
            });
        } else {
            return checkBookmarkCallback(null, resource)
        }
    }

    async.waterfall([
        getResources,
        markViewed,
        checkBookmark    
    ], function (error, result) {
        if (error) {
            return res.status(400).json(Response.build('ERROR', 
                errorHelper.parseError(error) 
            ));   
        }
        return res.status(200).json(Response.build('SUCCESS', result ));
    });
}

exports.update              = (req, res) => {


    const getResources      = function(getResourcesCallback) {
        const payload       = {
            slugUrl         : req.body.slugUrl
        }
        resourceService.getResources(payload, function(error, resource) {
            if(error) {
                return getResourcesCallback(error);
            } 
            return getResourcesCallback(null, resource);
        });
    }

    const updateResource      = function(content, updateResourceCallback) {
        let resource          = content[0];
        if(resource && req.decoded.userId == resource.author) {
            const payload     = {
                'resourceId'    : resource.resourceId,
                'title'         : req.body.title.trim(),
                'description'   : req.body.description.trim(),
                'blocks'        : req.body.blocks,
                'tags'          : req.body.tags,
                'resourceType'  : req.body.resourceType,
                'resourceLevel' : req.body.resourceLevel,
                'blocksCount'   : Object.keys(req.body.blocks).length,
                'slugUrl'       : req.body.slugUrl,
                'author'        : resource.author    
            }
            resourceService.updateResource(payload, function(error, result) {
                if(error) {
                    return updateResourceCallback(error);
                } 
                return updateResourceCallback(null, result);
            });
        } else {
            return updateResourceCallback('Permission denied.')
        }
    }

    async.waterfall([
        getResources,
        updateResource
    ], function (error, result) {
        if (error) {
            return res.status(400).json(Response.build('ERROR', 
                errorHelper.parseError(error) 
            ));   
        }
        return res.status(200).json(Response.build('SUCCESS', result ));
    });
}

exports.sayThanks           = (req, res) => {
    const slugUrl           = req.body.slugUrl;

    // update resourceUrl -> thanks count + thanks {}
    // add thanks in new table
    // ++ count in userProfile    
    const getResources      = function(getResourcesCallback) {
        const payload       = {
            slugUrl         : req.body.slugUrl
        }
        resourceService.getResources(payload, function(error, resource) {
            if(error) {
                return getResourcesCallback(error);
            } 
            if(resource.length == 0) return getResourcesCallback('Resource not found.')
            return getResourcesCallback(null, resource);
        });
    }

    const markThanks        = function(resource, markViewedCallback) {
        const payload       = {
            slugUrl         : slugUrl,
            thanked         : true
        };

        resourceService.updateCount(payload, function(error, result) {
            if(error) {
                return markViewedCallback(error);
            }
            return markViewedCallback(null, resource);
        });
    }

    const updateThanks      = function(resource, markViewedCallback) {
        const payload       = {
            'userId'        : resource[0].author,
            'thanks'        : true
        }

        userService.updateCount(payload, function(error, result) {
            if(error) {
                return markViewedCallback(error);
            }
            return markViewedCallback(null, {
                'message' : 'Success.'
            });
        })
    }

    async.waterfall([
        getResources,
        markThanks,
        updateThanks    
    ], function (error, result) {
        if (error) {
            return res.status(400).json(Response.build('ERROR', 
                errorHelper.parseError(error) 
            ));   
        }
        return res.status(200).json(Response.build('SUCCESS', result ));
    });
}

exports.bookmark            = (req, res) => {

    const addBookmark       = function(addBookmarkCallback) {
        const payload       = {
            resourceId      : req.params.resourceId,
            userId          : req.decoded.userId
        };

        resourceService.addBookmark(payload, function(error, result) {
            if(error) {
                return addBookmarkCallback(error);
            }
            return addBookmarkCallback(null, result);
        });
    }

    async.waterfall([
        addBookmark
    ], function (error, result) {
        if (error) {
            return res.status(400).json(Response.build('ERROR', 
                errorHelper.parseError(error) 
            ));   
        }
        return res.status(200).json(Response.build('SUCCESS', result ));
    });
}

exports.myBookmarks         = (req, res) => {
    const getBookmarks      = function(getBookmarksCallback) {
        const payload       = {
            userId          : req.decoded.userId
        }
        resourceService.getBookmarks(payload, function(error, result) {
            if(error) {
                return getBookmarksCallback(error);
            } 
            return getBookmarksCallback(null, result);
        });
    }

    async.waterfall([
        getBookmarks
    ], function (error, result) {
        if (error) {
            return res.status(400).json(Response.build('ERROR', 
                errorHelper.parseError(error) 
            ));   
        }
        return res.status(200).json(Response.build('SUCCESS', result ));
    });
}