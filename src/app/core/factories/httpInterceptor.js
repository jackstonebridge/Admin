angular.module('admin.core')
.factory('httpInterceptor', () => {
    return {
        response: function(response) {
            return response;
        }
    };
})
.config(['$httpProvider', ($httpProvider) => {
    $httpProvider.interceptors.push('httpInterceptor');
}]);
