angular.module('proton.admin')
    .directive('lookupOrganization', () => {
        return {
            replace: true,
            scope: {
                model: '='
            },
            controller: 'LookupController',
            controllerAs: 'vm',
            templateUrl: 'templates/admin/lookup/organization.html'
        };
    });
