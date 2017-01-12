angular.module('proton.admin')
.factory('monitors', ($http, $q, url) => {
    return {
        Monitor() {
            return $http.get(url.get() + '/admin/monitor');
        }
    };
});
