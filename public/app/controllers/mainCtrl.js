/*
    Controller written by - Pankaj tanwar
*/

angular.module('mainController', ['authServices'])

.controller('mainCtrl', function ($window,$http, auth, $timeout, $location, authToken, $rootScope, user) {

    let app     = this;

    app.loadme  = false;
    app.home    = true;

    $rootScope.$on('$routeChangeStart', function (event, next, current) {

        app.home        = !next.$$route;

        if(auth.isLoggedIn()) {
            app.isLoggedIn  = true;

            auth.getUser().then(function (data){
                app.user    = data.data.response[0];
                app.loadme  = true;
            }).catch(function (error) {
                app.loadme  = true;
                auth.logout();
                $route.reload();
            })

        } else {
            app.isLoggedIn  = false;
            app.loadme  = true;
        }

    });
});
