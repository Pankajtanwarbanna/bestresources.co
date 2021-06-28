/*
    Controller written by - Pankaj tanwar
*/

angular.module('mainController', ['authServices'])

.controller('mainCtrl', function ($window,$http, auth, $timeout, $location, authToken, $rootScope, user) {

    let app     = this;

    app.loadme  = false;
    app.home    = true;
    app.trend   = 'intresting';

    $rootScope.$on('$routeChangeStart', function (event, next, current) {

        app.home        = !next.$$route;

        getLoadingMsg();
        if(app.home) {
            getResources();
        }

        if(auth.isLoggedIn()) {
            app.isLoggedIn  = true;

            auth.getUser().then(function (data){
                app.user            = data.data.response[0];
                app.goodGuy         = app.user.firstName && app.user.lastName && app.user.about && app.user.twitter && app.user.linkedin;
                app.loadme          = true;
                app.authorized      = app.user.permission == 'admin';
            }).catch(function (error) {
                app.loadme          = true;
                auth.logout();
                $route.reload();
            })

        } else {
            app.isLoggedIn  = false;
            app.loadme  = true;
        }

    });

    // select trend
    app.selectTrend             = function(trend) {
        app.trend               = trend;
        getLoadingMsg();
        getResources(trend);
    }

    // fetch resources
    function getResources(trend = 'intresting') {

        user.getResources(trend).then(function(data) {
            app.resources       = data.data.response;
            app.loading         = false;
        }).catch(error => {
            let response        = error.data.response;
            app.errorMsg        = response.message;
            app.loading         = false;
        })
    }

    // search resources 
    app.searchResource          = () => {
        $location.path('/search/' + app.searchKey);
    }

    // take to resource page
    app.takeMeToResourcePage   = (url) => {
        $location.path('/resource/' + url);
    }

    // share page
    app.share                   = (url, title) => {
        app.url                 = window.location.href + '/resource/' + url;
        app.title               = title;
        app.twitterShare        = encodeURI('https://twitter.com/share?url=' + app.url + '&text=' + title + '   { from @bestresourcesCo }');
        app.linkedinShare       = encodeURI('https://www.linkedin.com/sharing/share-offsite/?url=' + app.url);
        app.whatsappShare       = encodeURI('https://api.whatsapp.com/send?text=' + title +' (from bestresources.co)' + app.url); 
    }

    // get loading message
    function getLoadingMsg() {
        const messages = [
            "Why don't you order a sandwich?",
            "The bits are flowing slowly today",
            "Have you lost weight?",
            "Do not run! We are your friends!",
            "Do you come here often?",
            "We're making you a cookie.",
            "Is this Windows?",
            "I swear it's almost done.",
            "Keeping all the 1's and removing all the 0's...",
            "Convincing AI not to turn evil..",
            "Trying to sort in O(n)...",
            "Installing dependencies",
            "Let's hope it's worth the wait",
            "You seem like a nice person...",
            "Making stuff up. Please wait...",
            "Loading the Loading message....",
            "Still faster than Windows update.",
            "Fighting the dragon.."
        ]

        let minValue        = 0;
        let maxValue        = messages.length - 1;
        let messageIndex    = (Math.floor(Math.random() * (+maxValue - +minValue)) + +minValue);
        app.loading         = true;
        app.loadingMsg      = messages[messageIndex];
    }
});
