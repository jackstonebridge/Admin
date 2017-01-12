angular.module('proton.admin')
.factory('invites', ($http, $q, url) => {
    return {
        CreateInvite(data) {
            return $http.post(url.get() + '/admin/invite', data);
        },
        SendInvite(user_id) {
            return $http.get(url.get() + '/admin/invites/' + user_id + '/send');
        },
        UpdateInviteEmail(user_id) {
            return $http.get(url.get() + '/admin/invites/' + user_id + '/email');
        }
    };
});
