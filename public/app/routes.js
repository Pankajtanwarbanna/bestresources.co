let app = angular.module('userRoutes', ['ngRoute'])

    .config(function ($routeProvider, $locationProvider) {
        $routeProvider

            .when('/join', {
                templateUrl     : '/app/views/join/join.html',
                authenticated   : false
            })

            .when('/resource', {
                templateUrl     : '/app/views/resources/resource.html',
                authenticated   : false
            })
            
            .when('/add-resource', {
                templateUrl     : '/app/views/resources/add-resource.html',
                authenticated   : false
            })

            .when('/tags', {
                templateUrl     : '/app/views/tags/tags.html',
                authenticated   : false
            })

            .when('/profile', {
                templateUrl     : '/app/views/profile/profile.html',
                authenticated   : false
            })

            .when('/notifications', {
                templateUrl     : '/app/views/profile/notifications.html',
                authenticated   : false
            })

            .when('/bookmarks', {
                templateUrl     : '/app/views/bookshelf/my-bookshelf.html',
                authenticated   : false
            })

            .when('/team', {
                templateUrl     : '/app/views/team/team.html',
                authenticated   : false
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
                    $location.path('/');
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