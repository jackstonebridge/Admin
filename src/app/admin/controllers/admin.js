angular.module('proton.admin')
.controller('AdminController', function(admins, adminData) {
    var vm = this;

    console.log(adminData);

    vm.Admins = adminData.Admins;
    vm.Supers = adminData.Supers;

    vm.GetAdmins = () => {
        admins.get()
        .then(({data}) => {
            vm.Admins = data.Admins;
            vm.Supers = data.Supers;
        });
    };
});
