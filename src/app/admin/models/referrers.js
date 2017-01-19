angular.module('proton.admin')
    .factory('referrers', ($http, $q, url) => {
        return {
            GetReferrers() {
                return $http.get(url.get() + '/admin/referrers');
            },
            GetReferrerDetails(name) {
                return $http.get(url.get() + '/admin/referrers/' + name);
            }
        };
    });
