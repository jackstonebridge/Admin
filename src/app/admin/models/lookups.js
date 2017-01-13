angular.module('proton.admin')
.factory('lookups', ($http, $q, url) => {
    return {
        LookupUser(name) {
            return $http.get(url.get() + '/admin/lookup/user/' + encodeURIComponent(name));
        },
        LookupOrganization(name) {
            return $http.get(url.get() + '/admin/lookup/domain/' + encodeURIComponent(name));
        },
        LookupDomain(name) {
            return $http.get(url.get() + '/admin/lookup/organization/' + encodeURIComponent(name));
        },
        LookupCharge(name) {
            return $http.get(url.get() + '/admin/lookup/charge/' + encodeURIComponent(name));
        }
    };
});
