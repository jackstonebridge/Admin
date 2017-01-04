angular.module('RDash')
.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
    function($stateProvider, $urlRouterProvider, $locationProvider) {
        // For unmatched routes
        $urlRouterProvider.otherwise('/');

        // Use the HTML5 History API
        $locationProvider.html5Mode(true);

        // Application routes
        $stateProvider
            // ------------
            // LOGIN ROUTES
            // ------------
            .state('public.index', {
                url: '/',
                controller: 'LoginController',
                templateUrl: 'templates/login.html'
            })
            .state('private.lookup', {
                url: '/lookup/:query',
                templateUrl: 'templates/lookup.html'
            })
            .state('private.coupons', {
                url: '/coupons',
                templateUrl: 'templates/coupons.html'
            })
            .state('private.invites', {
                url: '/invites',
                templateUrl: 'templates/invites.html'
            })
            .state('private.payments', {
                url: '/payments',
                templateUrl: 'templates/payments.html'
            })
            .state('private.logs', {
                url: '/logs',
                templateUrl: 'templates/logs.html'
            })
            .state('private.reports', {
                url: '/reports',
                templateUrl: 'templates/reports.html'
            })
            .state('private.monitor', {
                url: '/monitor',
                templateUrl: 'templates/monitor.html'
            })
            .state('private.messages', {
                url: '/messages',
                templateUrl: 'templates/messages.html'
            })
            .state('private.blast', {
                url: '/blast',
                templateUrl: 'templates/blast.html'
            })
            .state('private.multi-lookup', {
                url: '/multi-lookup',
                templateUrl: 'templates/multi.html'
            })
            .state('private.admin-list', {
                url: '/admin-list',
                templateUrl: 'templates/admins.html'
            });
    }
]);
