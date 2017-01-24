angular.module('proton.admin')
    .factory('authFactory', (users) => {
        var admin = null;

        var Initialize = () => {
            return users.UserInfo()
                .then(({
                    data
                }) => {
                    admin = data.User;
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
