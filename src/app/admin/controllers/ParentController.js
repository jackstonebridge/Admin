angular.module('proton.admin')
    .controller('ParentController', function(adminFactory) {
        var vm = this;
        adminFactory.Initialize().then(function () {
            vm.Admin = adminFactory.IsAdmin();
            vm.Super = adminFactory.IsSuper();
        });
    });
