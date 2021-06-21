const constant              = require(__basePath + 'app/config/constant');
const errorHelper           = require(constant.path.app + 'util/errorHelper');
const ResponseHelper        = require(constant.path.app + 'util/response');

exports.resourceValidator   = function (req, res, next) {
    
    let validationSchema    = {
        'title'             : {
            notEmpty        : true,
            errorMessage    : 'Title cannot be empty!'
        },
        'description'       : {
            notEmpty        : true,
            errorMessage    : 'Description cannot be empty!'
        },
        'blocks'            : {
            notEmpty        : true,
            errorMessage    : 'Resource blocks cannot be empty!'
        },
        'tags'              : {
            notEmpty        : true,
            errorMessage    : 'Tags cannot be empty!'
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

