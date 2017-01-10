angular.module('proton.admin')
.controller('AdminController', function(admins, $http) {
    var vm = this;
    console.log($http.defaults.headers.common);
    vm.GetAdmins = () => {
        admins.get()
        .then(({data}) => {
            this.Admins = data.Admins;
            this.Supers = data.Supers;
        });
    };
});
