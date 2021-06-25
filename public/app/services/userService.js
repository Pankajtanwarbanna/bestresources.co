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

    // user.getResources();
    userFactory.getResources        = function(trend) {
        return $http.get('/api/resources?trend='+ trend);
    }

    // user.fetchResource(slugUrl)
    userFactory.fetchResource       = function(slugUrl) {
        return $http.get('/api/resources/' + slugUrl);
    }

    // user.updateResource(slugUrl)
    userFactory.updateResource       = function(resourceData) {
        return $http.post('/api/resources/edit', resourceData);
    }

    // user.sayThanks(slugUrl)
    userFactory.sayThanks           = function(slugUrl) {
        return $http.post('/api/resources/thanks', { slugUrl });
    }

    // user.getUser(userId)
    userFactory.getUser             = function(userId) {
        return $http.get('/api/user/' + userId);
    }

    // user.bookmark(resourceId);
    userFactory.bookmark            = function(resourceId) {
        return $http.post('/api/resources/' + resourceId + '/bookmark')
    }

    // user.myBookmarks()
    userFactory.myBookmarks         = function() {
        return $http.get('/api/resources/bookmarks');
    }

    // user.submitTag()
    userFactory.submitTag         = function(tagData) {
        return $http.post('/api/tags/new', tagData);
    }

    // user.getTags()
    userFactory.getTags             = function() {
        return $http.get('/api/tags/get');
    }

    return userFactory;
});
