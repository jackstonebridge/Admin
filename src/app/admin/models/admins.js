angular.module('proton.admin')
.factory('admins', ($http, $q, url) => {
    return {
        get() {
            return $http.get(url.get() + '/admin/admins');
        }
    };
});
