angular.module('uploadFileService', [])

.service('upload', function ($http) {

    // Upload Image
    this.uploadImage = function (file) {

        let fd = new FormData();

        fd.append('thumbnail', file.thumbnail);

        return $http.post('/api/user/uploadImage', fd, {
            transformRequest: angular.identity,
            headers : { 'content-type' : undefined }
        })
    };
})
