angular.module('bestResourcesApp', ['userRoutes','userCtrl','mainController'])

.config(function ($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
});
