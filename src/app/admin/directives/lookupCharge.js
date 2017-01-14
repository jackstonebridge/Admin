angular.module('proton.admin')
    .directive('lookupCharge', () => {
        return {
            replace: true,
            scope: {
                model: '='
            },
            controller: 'LookupController',
            controllerAs: 'vm',
            templateUrl: 'templates/admin/lookup/charge.html'
        };
    });
