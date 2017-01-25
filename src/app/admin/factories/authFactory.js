angular.module('proton.admin')
    .factory('authFactory', ($rootScope, users) => {
        var admin = null;

        var Initialize = () => {
            if (admin) { return admin; }
            return users.UserInfo()
                .then(({
                    data
                }) => {
                    admin = data.User;
                    $rootScope.$emit('authFactory');
                });
        };

        var GetUserName = () =>  {
            return admin.UserName;
        };

        var IsAdmin = () => {
            return (admin.Status === 3);
        };

        var IsSuper = () => {
            return (admin.Status === 4);
        };

        return {
            Initialize,
            GetUserName,
            IsAdmin,
            IsSuper
        };
    });
