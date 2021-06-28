/*
    Controller written by - Pankaj tanwar
*/
angular.module('userCtrl', ['userServices', 'authServices'])

.controller('joinController', function (user, $routeParams) {
    let app = this;

    app.actionMsg           = {
        'thanks'            : 'You need to login before thanking the author.',
        'bookmark'          : 'You need to login before bookmarking the resourse.',
        'login'             : 'You need to login to proceed further.'
    }

    app.action              = app.actionMsg[$routeParams.action];

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
    try {
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
    }
    catch(err) {
        app.errorMsg    = 'Link does not seem to be correct. Would you mind checking it again?'
    }
})

.controller('profileController', function(user, $timeout, $scope) {
    let app             = this;

    app.loading         = false;

    // update profile
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
            app.loading         = false;
        }).catch(error => {
            let response        = error.data.response;
            app.errorMsg        = response.message;
            app.loading         = false;
        })
    }
})

.controller('resourceController', function(user, auth, $routeParams, $location) {
    let app                     = this;

    let slugUrl                 = $routeParams.resourceSlugUrl;
    app.loading                 = true;

    user.fetchResource(slugUrl).then(function(data) {
        let response            = data.data.response;
        if(response.length == 0) {
            app.invalidUrl          = true;
        } else {
            app.content             = response[0];
            app.isBookmarked        = app.content.bookmarked;    
        }
        app.loading             = false;
    }).catch(error => {
        let response            = error.data.response;
        app.errorMsg            = response.message;
        app.loading             = false;
    });

    // say thanks to author
    app.sayThanks               = () => {
        if(auth.isLoggedIn()) {
            app.content.thanksCount += 1;
            if(!app.thanked) {
                app.thanked             = true;
                user.sayThanks(slugUrl).then(function(data) {
                    let response        = data.data.response;
                }).catch(error => {
                    let response            = error.data.response;
                    app.errorMsg            = response.message;
                    app.loading             = false;
                });
            }
        } else {
            $location.path('/join')
        }
    }

    // share
    app.share                   = (url, title) => {
        app.url                 = window.location.href;
        app.twitterShare        = encodeURI('https://twitter.com/share?url=' + app.url + '&text=' + title + '   { from @bestresourcesCo }');
        app.linkedinShare       = encodeURI('https://www.linkedin.com/sharing/share-offsite/?url=' + app.url);
        app.whatsappShare       = encodeURI('https://api.whatsapp.com/send?text=' + title +' (from bestresources.co)' + app.url); 
    }

    // book mark
    app.bookmark                = (resourceId) => {
        if(auth.isLoggedIn()) {
            app.isBookmarked    = true;
            user.bookmark(resourceId).then(function(data) {
                let response            = data.data.response;
            }).catch(error => {
                let response            = error.data.response;
                app.errorMsg            = response.message;
            });
        } else {
            // TODO Pass message also here /join?action=thanks
            $location.path('/join')
        }
    }
})

.controller('editResourceController', function(user, $scope, $routeParams, $timeout,$location) {
    let app                         = this;

    let slugUrl                 = $routeParams.resourceId;
    app.loading                 = true;

    function isValidURL(string) {
        var res = string.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
        return (res !== null)
    };

    $scope.verifyLink               = (link, blockIndex, linkIndex) => {
        app.resourceData.blocks[blockIndex].links[linkIndex].verified   = link && isValidURL(link);
    }

    $scope.addResourceBlock         = () => {
        app.blocks                      += 1;
        app.resourceData.blocksCount    += 1;
        app.resourceData.blocks[app.blocks - 1] = {
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

    // fetch resource
    user.fetchResource(slugUrl).then(function(data) {
        let response            = data.data.response;
        app.resourceData        = response[0];
        app.blocks              = Object.keys(app.resourceData.blocks).length;
        app.loading             = false;
    }).catch(error => {
        let response            = error.data.response;
        app.errorMsg            = response.message;
        app.loading             = false;
    });

    // update resource
    app.updateResource          = function(resourceData) {
        app.editLoading         = true;
        app.errorMsg            = '';
        user.updateResource(resourceData).then((data) => {
            let response            = data.data.response;
            app.successMsg          = response.message;
            app.editLoading         = false;
            app.url                 = response.url;
            $timeout(function() {
                $location.path(response.url)
            }, 3000);
        }).catch(error => {
            let response            = error.data.response;
            app.errorMsg            = response.message;
            app.editLoading         = false;
        });
    }
})

.controller('userController' , function(user, $routeParams) {
    let app             = this;
    app.userId          = $routeParams.userId;
    app.loading         = true;

    user.getUser(app.userId).then(function(data) {
        let response        = data.data.response;
        app.user            = response[0];
        app.loading         = false;
    }).catch(error => {
        let response            = error.data.response;
        app.errorMsg            = response.message;
        app.loading             = false;
    });
})

.controller('bookmarkController', function(user) {
    let app             = this;
    app.loading         = true;

    user.myBookmarks().then(function(data) {
        let response            = data.data.response;
        app.myBookmarks         = response;
        app.loading             = false;
    }).catch(error => {
        let response            = error.data.response;
        app.errorMsg            = response.message;
        app.loading             = false;
    });
})

.controller('tagController', function(user) {
    let app                     = this;
    app.tagsLoading             = true;

    user.getTags().then(function(data) {
        let response            = data.data.response;
        app.tags                = response;
        app.tagsLoading         = false;
    }).catch(error => {
        let response            = error.data.response;
        app.errorMsg            = response.message;
        app.tagsLoading         = false;
    });

    // add new tag
    app.submitTag               = (tagData) => {
        app.loading             = true;
        user.submitTag(app.tagData).then(function(data) {
            let response            = data.data.response;
            app.successMsg          = response.message;
            app.loading             = false;
        }).catch(error => {
            let response            = error.data.response;
            app.errorMsg            = response.message;
            app.loading             = false;
        });
    }
})

.controller('hashTagController', function(user, $routeParams) {
    let app                     = this;
    app.loading                 = true;
    app.tagSlug                 = $routeParams.tagSlug;

    user.searchByTag(app.tagSlug).then(function(data) {
        let response            = data.data.response;
        app.resources           = response;
        app.loading             = false;
    }).catch(error => {
        let response            = error.data.response;
        app.errorMsg            = response.message;
        app.loading             = false;
    });
})

.controller('searchController', function(user, $routeParams, $location) {
    let app         = this;

    app.searchKey   = $routeParams.searchKey;
    app.loading     = true;

    // search resources
    user.searchResources(app.searchKey).then(function(data) {
        app.resources       = data.data.response;
        app.loading         = false;
        console.log(app.resources)
    }).catch(error => {
        let response        = error.data.response;
        app.errorMsg        = response.message;
        app.loading         = false;
    })

    // search 
    app.searchResource      = function() {
        $location.path('/search/' + app.searchKey);
    }
});