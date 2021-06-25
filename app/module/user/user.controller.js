const async                 = require("async");
const constant              = require(__basePath + '/app/config/constant');
const Response              = require(constant.path.app + 'util/response');
const errorHelper           = require(constant.path.app + 'util/errorHelper');
const userService           = require(constant.path.module + 'user/user.service');
const magicService          = require(constant.path.app + 'service/magic.service');
const mailService           = require(constant.path.app + 'service/mail.service');
const Utility               = require(constant.path.app + 'util/utility');

exports.join                = (req, res) => {
    
    const payload           = {
        'email'             : req.body.email
    }

    const getUser           = function(getUserCallback) {
        userService.findUser(payload, function(error, user) {
            if(error) {
                return getUserCallback(error);
            } 
            return getUserCallback(null, user);
        });
    }

    const createUser        = function(user, createUserCallback) {
        // Create if user not found
        if(Utility.isEmpty(user)) {
            userService.createUser(payload, function(error, user) {
                if(error) {
                    return createUserCallback(error);
                } 
                return createUserCallback(null, user);
            });
        } else {
            return createUserCallback(null, user);
        }
    }

    const generateMagicLink = function(userInfo, generateMagicLinkCallback) {
        const payload       = {
            'email'         : req.body.email,
            'userId'        : userInfo[0].userId
        }

        magicService.createLink(payload, function(error, linkInfo) {
            if(error) {
                return generateMagicLinkCallback(error);
            }
            return generateMagicLinkCallback(null, linkInfo)
        })
    }

    const sendEmail         = function(link, sendEmailCallback) {
        const payload       = {
            'event'         : 'auth',
            'email'         : req.body.email,
            'link'          : link
        }
        mailService.hitEmail(payload, function(error, result) {
            if(error) {
                return sendEmailCallback(error);
            } else {
                result              = {
                    'message'       : 'We have sent the magic link to your email, and we need your help to open it.'
                }
                return sendEmailCallback(null, result);    
            }
        })
    }

    async.waterfall([
        getUser,
        createUser,
        generateMagicLink,
        sendEmail
    ], function (error, result) {
        if (error) {
            return res.status(400).json(Response.build('ERROR', 
                errorHelper.parseError(error) 
            ));   
        }
        return res.status(200).json(Response.build('SUCCESS', result ));
    });
}

exports.verify          = (req, res) => {

    const verifyToken   = function(verifyTokenCallback) {
        const token     = req.query.token;

        magicService.verifyLink(token, function(error, userInfo) {
            if(error) {
                return verifyTokenCallback(error);
            }
            return verifyTokenCallback(null, userInfo);
        });
    }

    const updateUser    = function(userInfo, updateUserCallback) {
        const payload   = {
            'userId'    : userInfo.userId,
            'verified'  : true
        }

        userService.updateUser(payload, function(error, result) {
            if(error) {
                return updateUserCallback(error);
            }
            return updateUserCallback(null, userInfo);
        })
    }

    const generateAuth  = function(userInfo, generateAuthCallback) {
        userService.generateAuth(userInfo, function(error, auth) {
            if(error) {
                return generateAuthCallback(error);
            }
            return generateAuthCallback(null, auth);
        })
    }

    async.waterfall([
        verifyToken,
        updateUser,
        generateAuth
    ], function (error, result) {
        if (error) {
            return res.status(400).json(Response.build('ERROR', 
                errorHelper.parseError(error) 
            ));   
        }
        return res.status(200).json(Response.build('SUCCESS', result ));
    });
}

exports.me              = (req, res) => {
    return res.status(200).json(Response.build('SUCCESS', req.user ));
}

exports.update          = (req, res) => {

    const payload       = {
        'userId'        : req.decoded.userId,
        'firstName'     : req.body.firstName,
        'lastName'      : req.body.lastName,
        'about'         : req.body.about,
        'twitter'       : req.body.twitter,
        'linkedin'      : req.body.linkedin,
        'website'       : req.body.website,
        'youtube'       : req.body.youtube
    }

    userService.updateUser(payload, function(error, result) {
        if(error) {
            return res.status(400).json(Response.build('ERROR', 
                errorHelper.parseError(error) 
            ));        
        }
        return res.status(200).json(Response.build('SUCCESS', {
            'message'   : 'your profile is updated successfully.'
        }));
    })
}

exports.user            = (req, res) => {
    const payload       = {
        userId          : req.params.userId
    };

    const getUser           = function(getUserCallback) {
        userService.findUser(payload, function(error, user) {
            if(error) {
                return getUserCallback(error);
            } 
            return getUserCallback(null, user);
        });
    }

    async.waterfall([
        getUser
    ], function (error, result) {
        if (error) {
            return res.status(400).json(Response.build('ERROR', 
                errorHelper.parseError(error) 
            ));   
        }
        return res.status(200).json(Response.build('SUCCESS', result ));
    });
}