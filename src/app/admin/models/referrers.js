angular.module('proton.admin')
    .factory('referrers', ($http, $q, url) => {
        return {
            GetReferrers() {
                return $http.get(url.get() + '/admin/referrers');
            },
            GetReferrerDetails(name, start_time, end_time) {
                return $http.get(url.get() + '/admin/referrers/' + name + '?StartTime=' + start_time / 1000 + '&EndTime=' + end_time / 1000);
            }
        };
    });
