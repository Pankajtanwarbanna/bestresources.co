const constant          = require(__basePath + 'app/config/constant');
const router            = require('express').Router({
    caseSensitive       : true,
    strict              : true
});
const jwtMiddleware     = require(constant.path.middleware + '/jwt.middleware');
const authMiddleware    = require(constant.path.middleware + '/auth.middleware');

const resourceController    = require(constant.path.module + 'resource/resource.controller');
const resourceValidator     = require(constant.path.module + 'resource/resource.validator');

router.post(
    '/new',
    jwtMiddleware.verify,
    authMiddleware.ensureUser,
    resourceValidator.resourceValidator,
    resourceController.new
);

router.get(
    '/',
    resourceController.get
);

router.get(
    '/:slugUrl',
    resourceValidator.getResourceValidator,
    resourceController.getResource
);

module.exports = {
    router: router
};