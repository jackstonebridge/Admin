angular.module('proton.admin')
.factory('payments', ($http, $q, url) => {
    return {
        get(time) {
            return $http.get(url.get() + '/admin/payments/' + time);
        }
    };
});
