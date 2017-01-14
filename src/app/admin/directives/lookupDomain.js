angular.module('proton.admin')
    .directive('lookupDomain', () => {
        return {
            replace: true,
            scope: {
                model: '='
            },
            controller: 'LookupController',
            controllerAs: 'vm',
            templateUrl: 'templates/admin/lookup/domain.html'
        };
    });
