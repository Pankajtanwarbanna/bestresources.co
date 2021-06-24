const constant          = require(__basePath + 'app/config/constant');
const router            = require('express').Router({
    caseSensitive       : true,
    strict              : true
});
const jwtMiddleware     = require(constant.path.middleware + '/jwt.middleware');
const authMiddleware    = require(constant.path.middleware + '/auth.middleware');

const tagController    = require(constant.path.module + 'tag/tag.controller');
const tagValidator     = require(constant.path.module + 'tag/tag.validator');

router.post(
    '/new',
    jwtMiddleware.verify,
    authMiddleware.ensureUser,
    tagValidator.newTagValidator,
    tagController.new
);

router.get(
    '/get',
    tagController.get
);

module.exports = {
    router: router
};