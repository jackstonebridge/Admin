angular.module('proton.admin')
    .directive('sidebar', () => {
        return {
            replace: true,
            controller: 'ParentController',
            controllerAs: 'vm',
            templateUrl: 'templates/admin/sidebar.html'
        };
    });
