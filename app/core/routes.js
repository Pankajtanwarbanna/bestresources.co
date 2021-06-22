const constant = require(__basePath + 'app/config/constant');

module.exports = function (app) {
	app.use('/api/monitor', 	require(constant.path.module + 'monitor/index.js').router);
	app.use('/api/user', 		require(constant.path.module + 'user/index.js').router);
	app.use('/api/resources', 	require(constant.path.module + 'resource/index.js').router);
};