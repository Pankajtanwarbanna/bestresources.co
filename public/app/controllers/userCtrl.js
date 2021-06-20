/*
    Controller written by - Pankaj tanwar
*/
angular.module('userCtrl', ['userServices', 'authServices'])

.controller('joinController', function (user) {
    var app = this;

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
    var app             = this;

    app.verified        = false;
    app.saparator       = '_$_';

    app.magicToken      = $routeParams.token;
    app.data            = decodeURIComponent(escape(window.atob(app.magicToken)));
    
    app.data            = app.data ? app.data.split(app.saparator) : null;

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
});

