angular.module('proton.admin')
    .factory('adminFactory', (users) => {
        var user = null;

        var UserInfo = () => {
            users.UserInfo()
                .then(({
                    data
                }) => {
                    user = data.User;
                });
        };
        UserInfo();

        var GetUserName = () =>  {
            return user.UserName;
        };

        var IsAdmin = () => {
            return (user.Status === 3);
        };

        var IsSuper = () => {
            return (user.Status === 4);
        };

        return {
            GetUserName,
            IsAdmin,
            IsSuper
        };
    });
