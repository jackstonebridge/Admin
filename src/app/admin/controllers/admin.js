angular.module('proton.admin')
.controller('AdminController', function(admins) {
    var vm = this;

    vm.GetAdmins = () => {
        admins.get()
        .then(({data}) => {
            vm.Admins = data.Admins;
            vm.Supers = data.Supers;
        });
    };
});
