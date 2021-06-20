const constant  = require(__basePath + '/app/config/constant');
const response  = require(constant.path.app + 'util/response');

exports.ping    = function (req, res) {
    return res.status(200).json(response.build('SUCCESS', { message : 'pong'}));
};