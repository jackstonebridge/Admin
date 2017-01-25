angular.module('proton.admin')
.controller(
    'SidebarController',
    function($rootScope, authFactory, CONFIG) {
        var vm = this;

        vm.Version = CONFIG.version;
        vm.IsAdmin = null;
        vm.IsSuper = null;
        vm.Username = null;

        vm.Initialize = () => {
            vm.IsAdmin = authFactory.IsAdmin();
            vm.IsSuper = authFactory.IsSuper();
            vm.Username = authFactory.GetUserName();
        };

        $rootScope.$on('authFactory', function() {
            vm.Initialize();
        });
    }
);
