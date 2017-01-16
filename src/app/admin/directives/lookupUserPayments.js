angular.module('proton.admin')
    .directive('lookupUserPayments', () => {
        return {
            replace: true,
            scope: {
                model: '='
            },
            controller: 'PaymentController',
            controllerAs: 'vm',
            templateUrl: 'templates/admin/lookup/payments.html'
        };
    });
