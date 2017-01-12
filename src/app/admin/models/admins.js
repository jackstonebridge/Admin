angular.module('proton.admin')
.factory('admins', ($http, $q, url) => {
    return {
        GetAdmins() {
            return $http.get(url.get() + '/admin/admins');
        }
    };
});
