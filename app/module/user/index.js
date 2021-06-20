const constant          = require(__basePath + 'app/config/constant');
const router            = require('express').Router({
    caseSensitive       : true,
    strict              : true
});
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

module.exports = {
    router: router
};