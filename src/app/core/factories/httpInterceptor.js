angular.module('admin.core')
.factory('httpInterceptor', ($rootScope, $q) => {
    return {
        request(config) {
            $rootScope.loading = true;
            return config;
        },
        response(response) {
            var data = response.data = response.data || {};
            var error = (data.ErrorDescription) ? data.ErrorDescription : data.Error;

            $rootScope.loading = false;
            if (error) {
                $rootScope.$emit('addAlert', error);
                return $q.reject(response);
            }
            return $q.resolve(response);
        },
        responseError(response) {
            $rootScope.loading = false;
            $rootScope.$emit('addAlert', response);
            return $q.reject(response);
        }
    };
})
.config(['$httpProvider', ($httpProvider) => {
    $httpProvider.interceptors.push('httpInterceptor');
}]);
