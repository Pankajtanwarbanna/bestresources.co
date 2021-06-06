const constant = require(__basePath + 'app/core/constant');

module.exports = function (app) {
	app.use('/api/monitor', 	require(constant.path.module + 'monitor/index.js').router);
};