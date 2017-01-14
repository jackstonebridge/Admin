angular.module('proton.admin')
    .directive('lookupDomain', () => {
        return {
            replace: true,
            scope: {
                model: '='
            },
            templateUrl: 'templates/admin/lookup/domain.html'
        };
    });
