/*
    Controller written by - Pankaj tanwar
*/
angular.module('userCtrl', ['userServices', 'authServices'])

.controller('joinController', function (user) {
    let app = this;

    // Send Magic Link
    app.sendMagicLink       = (joinData) => {

        app.loading         = true;

        user.join(app.joinData).then(function(data) {
            let response        = data.data.response;
            app.successMsg      = response.message;
            app.loading         = false;
        }).catch(error => {
            let response        = error.data.response;
            app.errorMsg        = response.message;
            app.loading         = false;
        })
    }
})

.controller('verifyController', function (user, authToken, $routeParams, $location, $timeout) {
    let app             = this;

    app.verified        = false;
    app.saparator       = '_$_';

    app.magicToken      = $routeParams.token;
    app.data            = decodeURIComponent(escape(window.atob(app.magicToken)));
    
    app.data            = app.data ? app.data.split(app.saparator) : null;

    // Verify token
    if(app.data && app.data.length == 2) {
        app.email       = app.data[0];
        user.verifyToken(app.magicToken).then(function(data) {
            let response        = data.data.response;
            app.successMsg      = response.message;
            app.verified        = true;
            authToken.setToken(response.auth);
            $timeout(function() {
                $location.path('/')
            }, 2000);
        }).catch(error => {
            let response        = error.data.response;
            app.errorMsg        = response.message;
        })
    } else {
        app.errorMsg    = 'Link does not seem to be correct. Would you mind checking it again?'
    }
})

.controller('profileController', function(user, $timeout) {
    let app             = this;

    app.loading         = false;

    app.updateProfile   = function(profile) {
        app.loading     = true;

        user.updateProfile(profile).then(function(data) {
            let response        = data.data.response;
            app.successMsg      = response.message;
            app.loading         = false;
            $timeout(function() {
                app.successMsg  = '';
            }, 2000)
        }).catch(error => {
            let response        = error.data.response;
            app.errorMsg        = response.message;
            app.loading         = false;
        })
    } 
})

.controller('addResourceController' , function(user, $scope, $timeout, $location) {
    let app                         = this;
    app.resourceData                = {
        "total_blocks"              : 1,
        "blocks"                    : {
            0                       : {
                "total_links"       : 1
            }
        },
        "tags"                      : []
    };

    function isValidURL(string) {
        var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
        return (res !== null)
    };

    $scope.verifyLink               = (link, blockIndex, linkIndex) => {
        app.resourceData.blocks[blockIndex].links[linkIndex].verified   = link && isValidURL(link);
    }

    $scope.addResourceBlock         = () => {
        app.resourceData.total_blocks   += 1;
        app.resourceData.blocks[app.resourceData.total_blocks - 1] = {
            "total_links"       : 1
        }
    }

    $scope.addResourceBlockLink     = (blockIndex) => {
        if(!app.resourceData.blocks)                        app.resourceData.blocks = {};
        if(!app.resourceData.blocks[blockIndex])            app.resourceData.blocks[blockIndex] = {};
        app.resourceData.blocks[blockIndex].total_links   = app.resourceData.blocks[blockIndex].total_links ? app.resourceData.blocks[blockIndex].total_links + 1 : 1;
    }

    $scope.addResourceTag           = (tag) => {
        app.resourceData.tags.push(tag.toLowerCase());
        $scope.tag                  = null;
    }

    $scope.removeResourceTag        = (tagIndex) => {
        app.resourceData.tags.splice(tagIndex, 1);
    }

    app.postResource                = (resourceData) => {
        app.loading                 = true;
        user.postResource(app.resourceData).then(function(data) {
            let response        = data.data.response;
            app.successMsg      = response.message;
            app.url             = response.url;
            app.loading         = false;
            $timeout(function() {
                $location.path(response.url)
            }, 10000);
        }).catch(error => {
            let response        = error.data.response;
            app.errorMsg        = response.message;
            app.loading         = false;
        })
    }
})

.controller('resourceController', function(user, $routeParams) {
    let app                     = this;

    let slugUrl                 = $routeParams.resourceSlugUrl;
    app.loading                 = true;

    user.fetchResource(slugUrl).then(function(data) {
        let response            = data.data.response;
        app.content             = response[0];
        app.loading             = false;
    }).catch(error => {
        let response            = error.data.response;
        app.errorMsg            = response.message;
        app.loading             = false;
        app.loading             = false;
    })
})