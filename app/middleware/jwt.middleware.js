const constant          = require(__basePath + '/app/config/constant');
const Response          = require(constant.path.app + 'util/response');
const errorHelper       = require(constant.path.app + 'util/errorHelper');
const jwtService        = require(constant.path.app + 'service/jwt.service');

function verify(req, res, next) {
    const token = req.body.token || req.body.query || req.headers['x-access-token'];

    if(token) {
        // verify token
        try {
            req.decoded = jwtService.decode(token);
            next();
        } catch(err) {
            return res.status(400).json(Response.build('ERROR', 
                errorHelper.parseError('Token expired.') 
            ));   
        }
    } else {
        return res.status(400).json(Response.build('ERROR', 
            errorHelper.parseError('No token provided.') 
        ));   
    }
}

module.exports = {
    verify
}
