angular.module('proton.admin')
    .factory('adminFactory', (users) => {
        var admin = null;

        var Initialize = () => {
            users.UserInfo()
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
