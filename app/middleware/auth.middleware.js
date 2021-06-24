const constant              = require(__basePath + '/app/config/constant');
const Response              = require(constant.path.app + 'util/response');
const errorHelper           = require(constant.path.app + 'util/errorHelper');
const userService           = require(constant.path.module + 'user/user.service');
const Utility               = require(constant.path.app + 'util/utility');

function ensureUser(req, res, next) {

    if(!req.decoded.userId) {
        return res.status(400).json(Response.build('ERROR', 
            errorHelper.parseError('Please login.') 
        ));       
    } else {
        const payload       = {
            'userId'        : req.decoded.userId
        }
        userService.findUser(payload, function(error, user) {
            if(error) {
                return res.status(400).json(Response.build('ERROR', 
                    errorHelper.parseError('Something went wrong!') 
                ));               
            } 
            if(Utility.isEmpty(user)) {
                return res.status(400).json(Response.build('ERROR', 
                    errorHelper.parseError('User not found.') 
                ));   
            }
            req.user    = user;
            next();
        });
    }
}

function partialEnsureUser(req, res, next) {

    if(!req.decoded || !req.decoded.userId) {
        next();      
    } else {
        const payload       = {
            'userId'        : req.decoded.userId
        }
        userService.findUser(payload, function(error, user) {
            if(error) {
                return res.status(400).json(Response.build('ERROR', 
                    errorHelper.parseError('Something went wrong!') 
                ));               
            } 
            if(Utility.isEmpty(user)) {
                return res.status(400).json(Response.build('ERROR', 
                    errorHelper.parseError('User not found.') 
                ));   
            }
            req.user    = user;
            next();
        });
    }
}

module.exports = {
    ensureUser,
    partialEnsureUser
};