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
});
