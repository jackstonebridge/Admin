angular.module('proton.admin')
.filter('LogAuthEvent', () => {
    return function(log_auth_event) {
        switch (log_auth_event) {
            case 0:
                return "Login failure password";

            case 1:
                return "Login success";

            case 2:
                return "Logout";

            case 3:
                return "Login failure 2FA";

            default:
                return "Unknown log auth event value";
        }
    };
});
