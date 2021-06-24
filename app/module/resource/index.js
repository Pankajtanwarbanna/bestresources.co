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
    jwtMiddleware.partialVerify,
    authMiddleware.partialEnsureUser,
    resourceController.get
);

router.get(
    '/:slugUrl',
    jwtMiddleware.partialVerify,
    authMiddleware.partialEnsureUser,
    resourceValidator.getResourceValidator,
    resourceController.getResource
);

router.post(
    '/thanks',
    jwtMiddleware.verify,
    authMiddleware.ensureUser,
    resourceValidator.thanksValidator,
    resourceController.sayThanks
);

router.post(
    '/:resourceId/bookmark',
    jwtMiddleware.verify,
    authMiddleware.ensureUser,
    resourceController.bookmark
);

module.exports = {
    router: router
};