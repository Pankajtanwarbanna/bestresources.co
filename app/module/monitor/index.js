const constant = require(__basePath + 'app/core/constant');
const router   = require('express').Router({
    caseSensitive: true,
    strict       : true
});
const monitor  = require(constant.path.module + 'monitor/monitor.controller');

router.get(
    '/ping',
    monitor.ping
);

module.exports = {
    router: router
};