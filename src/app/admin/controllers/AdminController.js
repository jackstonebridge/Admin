angular.module('proton.admin')
    .controller('AdminController', function (admins, adminFactory) {
        var vm = this;

        vm.IsAdmin = adminFactory.IsAdmin();
        vm.IsSuper = adminFactory.IsSuper();

        var GetAdmins = () => {
            admins.GetAdmins()
                .then(({
                    data
                }) => {
                    vm.Response = data;
                    vm.Admins = data.Admins;
                    vm.Supers = data.Supers;
                });
        };

        GetAdmins();
    });
