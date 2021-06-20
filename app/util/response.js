const constant  = require(__basePath + 'app/config/constant');
const response  = require(constant.path.app + 'config/response');

response.build  = function (key, data) {
    const responseObj = response["RESPONSES"][key];

    return {
        status       : key === 'SUCCESS',
        statusCode   : responseObj.errorCode    || 500,
        statusMessage: responseObj.message      || '',
        response     : data || {}
    };
};

module.exports = response;