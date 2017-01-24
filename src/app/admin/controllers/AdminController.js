angular.module('proton.admin')
.controller(
    'AdminController',
    function (admins, authFactory) {
        var vm = this;

        vm.IsAdmin = authFactory.IsAdmin();
        vm.IsSuper = authFactory.IsSuper();

        var GetAdmins = () => {
            admins.GetAdmins()
                .then(({data}) => {
                    vm.Response = data;
                    vm.Admins = data.Admins;
                    vm.Supers = data.Supers;
                });
        };

        GetAdmins();
    }
);
