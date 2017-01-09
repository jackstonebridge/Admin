angular.module('admin.core')
.controller('AdminController', function(admins) {
    var vm = this;

    vm.GetAdmins = () => {
        admins.get()
        .then(({data}) => {
            this.Admins = data.Admins;
            this.Supers = data.Supers;
        });
    };
});
