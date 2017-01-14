angular.module('proton.admin')
    .directive('lookupOrganization', () => {
        return {
            replace: true,
            scope: {
                model: '='
            },
            templateUrl: 'templates/admin/lookup/organization.html'
        };
    });
