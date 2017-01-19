angular.module('proton.admin')
    .controller('ParentController', function(adminFactory) {
        var vm = this;

        vm.Admin = adminFactory.IsAdmin();
        vm.Super = adminFactory.IsSuper();
    });
