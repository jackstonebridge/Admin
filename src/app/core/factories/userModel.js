angular.module('admin.core')
.factory('userModel', function () {
    function isLoggedIn() {
        return false;
    }
    return {
        isLoggedIn
    };
});
