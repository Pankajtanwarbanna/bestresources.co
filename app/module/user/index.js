const constant          = require(__basePath + 'app/config/constant');
const router            = require('express').Router({
    caseSensitive       : true,
    strict              : true
});
const jwtMiddleware     = require(constant.path.middleware + '/jwt.middleware');
const authMiddleware    = require(constant.path.middleware + '/auth.middleware');

const userController    = require(constant.path.module + 'user/user.controller');
const userValidator     = require(constant.path.module + 'user/user.validator');

router.post(
    '/join',
    userValidator.joinValidator,
    userController.join
);

router.get(
    '/verify',
    userValidator.verifyValidator,
    userController.verify
);

router.get(
    '/me',
    jwtMiddleware.verify,
    authMiddleware.ensureUser,
    userController.me
);

router.put(
    '/update',
    jwtMiddleware.verify,
    authMiddleware.ensureUser,
    userController.update
);

router.get(
    '/:userId',
    userValidator.getUserValidator,
    userController.user
);

module.exports = {
    router: router
};