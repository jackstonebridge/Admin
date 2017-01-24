angular.module('proton.admin')
    .controller('ParentController', function(adminFactory) {
        var vm = this;
        adminFactory.Initialize().then(function () {
            vm.IsAdmin = adminFactory.IsAdmin();
            vm.IsSuper = adminFactory.IsSuper();
            vm.Username = adminFactory.GetUserName();
        });
    });
