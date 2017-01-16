angular.module('proton.admin')
.factory('lookups', ($http, $q, url) => {
    return {
        LookupUser(name, fuzzy = 0) {
            return $http.get(url.get() + '/admin/lookup/user/' + encodeURIComponent(name) + '?Fuzzy=' + encodeURIComponent(fuzzy));
        },
        LookupOrganization(name, fuzzy = 0) {
            return $http.get(url.get() + '/admin/lookup/organization/' + encodeURIComponent(name) + '?Fuzzy=' + encodeURIComponent(fuzzy));
        },
        LookupDomain(name, fuzzy = 0) {
            return $http.get(url.get() + '/admin/lookup/domain/' + encodeURIComponent(name) + '?Fuzzy=' + encodeURIComponent(fuzzy));
        },
        LookupCharge(name) {
            return $http.get(url.get() + '/admin/lookup/charge/' + encodeURIComponent(name));
        }
    };
});
