angular.module('proton.admin')
    .directive('lookupUser', () => {
        return {
            replace: true,
            scope: {
                model: '='
            },
            templateUrl: 'templates/admin/lookup/user.html'
        };
    });
