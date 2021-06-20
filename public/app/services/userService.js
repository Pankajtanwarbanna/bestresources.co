/*
    Services written by - Pankaj tanwar
*/
angular.module('userServices',[])

.factory('user', function ($http) {
    var userFactory             = {};

    // user.join(regData);
    userFactory.join            = function (regData) {
        return $http.post('/api/user/join' , regData);
    };

    // user.verifyToken(token)
    userFactory.verifyToken     = function(token) {
        return $http.get('/api/user/verify?token=' + token);
    }

    return userFactory;
});
