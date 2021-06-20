const constant              = require(__basePath + 'app/config/constant');
const errorHelper           = require(constant.path.app + 'util/errorHelper');
const ResponseHelper        = require(constant.path.app + 'util/response');

exports.joinValidator       = function (req, res, next) {
    
    let validationSchema    = {
        'email'             : {
            notEmpty        : true,
            errorMessage    : 'Email cannot be empty!'
        }
    };
    
    req.checkBody(validationSchema);

    req.getValidationResult().then(function (result) {
        if(false == result.isEmpty()) {
            return res.status(400).json(ResponseHelper.build(
                'ERROR_VALIDATION',
                errorHelper.parseValidationErrors(result.mapped())
            )).end();
        }
        
        next();
    });
};

exports.verifyValidator     = function (req, res, next) {
    
    let validationSchema    = {
        'token'             : {
            notEmpty        : true,
            errorMessage    : 'Token cannot be empty!'
        }
    };
    
    req.checkQuery(validationSchema);

    req.getValidationResult().then(function (result) {
        if(false == result.isEmpty()) {
            return res.status(400).json(ResponseHelper.build(
                'ERROR_VALIDATION',
                errorHelper.parseValidationErrors(result.mapped())
            )).end();
        }
        
        next();
    });
};

