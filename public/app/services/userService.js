/*
    Services written by - Pankaj tanwar
*/
angular.module('userServices',[])

.factory('user', function ($http) {
    var userFactory                 = {};

    // user.join(regData);
    userFactory.join                = function (regData) {
        return $http.post('/api/user/join' , regData);
    };

    // user.verifyToken(token)
    userFactory.verifyToken         = function(token) {
        return $http.get('/api/user/verify?token=' + token);
    }

    // user.updateProfile(profile)
    userFactory.updateProfile       = function(profile) {
        return $http.put('/api/user/update', profile);
    }
    
    // user.postResource(resourseData)
    userFactory.postResource        = function(data) {
        return $http.post('/api/resources/new', data)
    }

    return userFactory;
});
