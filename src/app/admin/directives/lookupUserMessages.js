angular.module('proton.admin')
    .directive('lookupUserMessages', () => {
        return {
            replace: true,
            scope: {
                model: '='
            },
            controller: 'MessageController',
            controllerAs: 'vm',
            templateUrl: 'templates/admin/lookup/messages.html'
        };
    });
