angular.module('proton.admin')
.controller('AdminController', function(admins) {
    var vm = this;

    var GetAdmins = () => {
        admins.GetAdmins()
        .then(({data}) => {
            vm.Response = data;
            vm.Admins = data.Admins;
            vm.Supers = data.Supers;
        });
    };

    GetAdmins();
});
