angular.module('proton.admin')
    .factory('httpInterceptor', ($rootScope, $q) => {

        const DEFAULT_ERROR = 'Something does not work as expected, sorry.';

        const hasError = ({
            data
        }) => !!((data.ErrorDescription) ? data.ErrorDescription : data.Error);
        const getError = ({
            data
        }) => {
            const error = (data.ErrorDescription) ? data.ErrorDescription : data.Error;
            return error || DEFAULT_ERROR;
        };


        return {
            request(config) {
                $rootScope.loading = true;
                return config;
            },
            response(response) {
                var data = response.data = response.data || {};
                $rootScope.loading = false;
                if (hasError(response)) {
                    $rootScope.$emit('addAlert', getError(response));
                    return $q.reject(response);
                }
                return $q.resolve(response);
            },
            responseError(response) {
                $rootScope.loading = false;
                response.data = response.data || {
                    Error: DEFAULT_ERROR
                };
                const error = getError(response);
                $rootScope.$emit('addAlert', error);
                return $q.reject(response.data);
            }
        };
    })
    .config(['$httpProvider', ($httpProvider) => {
        $httpProvider.interceptors.push('httpInterceptor');
    }]);
