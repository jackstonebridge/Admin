angular.module('proton.admin')
.controller(
    'ParentController',
    function(authFactory) {
        var vm = this;
        authFactory.Initialize().then(function () {
            vm.IsAdmin = authFactory.IsAdmin();
            vm.IsSuper = authFactory.IsSuper();
            vm.Username = authFactory.GetUserName();
        });
    }
);
