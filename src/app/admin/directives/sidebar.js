angular.module('proton.admin')
    .directive('sidebar', () => {
        return {
            replace: true,
            controller: 'SidebarController',
            controllerAs: 'vm',
            templateUrl: 'templates/admin/sidebar.html'
        };
    });
