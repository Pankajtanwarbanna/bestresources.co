let app = angular.module('userRoutes', ['ngRoute'])

    .config(function ($routeProvider, $locationProvider) {
        $routeProvider

            .when('/join', {
                templateUrl     : '/app/views/join/join.html',
                authenticated   : false,
                controller      : 'joinController',
                controllerAs    : 'join'
            })

            .when('/verify', {
                templateUrl     : '/app/views/join/verify.html',
                authenticated   : false,
                controller      : 'verifyController',
                controllerAs    : 'verify'
            })

            .when('/resource/:resourceSlugUrl', {
                templateUrl     : '/app/views/resources/resource.html',
                controller      : 'resourceController',
                controllerAs    : 'resource'
            })

            .when('/search/:searchKey', {
                templateUrl     : '/app/views/search/search.html',
                controller      : 'searchController',
                controllerAs    : 'search'
            })

            .when('/edit/:resourceId', {
                templateUrl     : '/app/views/resources/edit-resource.html',
                authenticated   : true,
                controller      : 'editResourceController',
                controllerAs    : 'editResource'
            })
            
            .when('/add-resource', {
                templateUrl     : '/app/views/resources/add-resource.html',
                authenticated   : true,
                controller      : 'addResourceController',
                controllerAs    : 'addResource'
            })

            .when('/tags', {
                templateUrl     : '/app/views/tags/tags.html',
                controller      : 'tagController',
                controllerAs    : 'tag'
            })

            .when('/tag/:tagSlug', {
                templateUrl     : '/app/views/tags/tag.html',
                controller      : 'hashTagController',
                controllerAs    : 'hashTag'
            })

            .when('/ideabox', {
                templateUrl     : '/app/views/ideabox/ideabox.html'
            })

            .when('/profile', {
                templateUrl     : '/app/views/profile/profile.html',
                authenticated   : true,
                controller      : 'profileController',
                controllerAs    : 'profile'
            })

            .when('/user/:userId', {
                templateUrl     : '/app/views/profile/user.html',
                controller      : 'userController',
                controllerAs    : 'user'
            })

            .when('/notifications', {
                templateUrl     : '/app/views/profile/notifications.html',
                authenticated   : true
            })

            .when('/bookmarks', {
                templateUrl     : '/app/views/bookshelf/my-bookshelf.html',
                authenticated   : true,
                controller      : 'bookmarkController',
                controllerAs    : 'bookmark'
            })

            .when('/about', {
                templateUrl     : '/app/views/team/team.html'
            })

            .otherwise( { redirectTo : '/'});

        $locationProvider.html5Mode({
            enabled : true,
            requireBase : false
        })
    });

app.run(['$rootScope','auth','$location', 'user', function ($rootScope,auth,$location,user) {

    $rootScope.$on('$routeChangeStart', function (event, next, current) {

        if(next.$$route) {
            if(next.$$route.authenticated === true) {

                if(!auth.isLoggedIn()) {
                    event.preventDefault();
                    $location.path('/join');
                } else if(next.$$route.permission) {

                    user.getPermission().then(function (data) {

                        if(next.$$route.permission !== data.data.permission) {
                            event.preventDefault();
                            $location.path('/');
                        }

                    });
                }

            } else if(next.$$route.authenticated === false) {
                if(auth.isLoggedIn()) {
                    event.preventDefault();
                    $location.path('/profile');
                }

            } /*else {
                console.log('auth doesnot matter');
            }
            */
        } /*else {
            console.log('Home route is here');
        }
*/
    })
}]);