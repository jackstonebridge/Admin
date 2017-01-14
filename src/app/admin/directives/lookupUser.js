angular.module('proton.admin')
    .directive('lookupUser', () => {
        return {
            replace: true,
            scope: {
                model: '='
            },
            controller: 'UserController',
            controllerAs: 'vm',
            templateUrl: 'templates/admin/lookup/user.html'
        };
    });
