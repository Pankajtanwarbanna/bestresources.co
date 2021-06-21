angular.module('bestResourcesApp', ['userRoutes','userCtrl','mainController','userFilters'])

.config(function ($httpProvider) {
    $httpProvider.interceptors.push('AuthInterceptors');
});
