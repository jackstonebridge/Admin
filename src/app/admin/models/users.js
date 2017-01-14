angular.module('proton.admin')
.factory('users', ($http, $q, url) => {
    return {
        CreditUser(user_id, body) {
            return $http.put(url.get() + '/admin/user/' + user_id + '/credit', body);
        }
    };
});
