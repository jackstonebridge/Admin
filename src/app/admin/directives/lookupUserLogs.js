angular.module('proton.admin')
    .directive('lookupUserLogs', () => {
        return {
            replace: true,
            scope: {
                model: '='
            },
            controller: 'LogController',
            controllerAs: 'vm',
            templateUrl: 'templates/admin/lookup/logs.html'
        };
    });
