angular.module('RDash')
.config(['$stateProvider', '$urlRouterProvider', '$locationProvider',
    function($stateProvider, $urlRouterProvider, $locationProvider) {
        // For unmatched routes
        $urlRouterProvider.otherwise('/login');

        // Use the HTML5 History API
        $locationProvider.html5Mode(true);

        // Application routes
        $stateProvider
            // ------------
            // LOGIN ROUTES
            // ------------
            .state('index', {
                url: '/login',
                controller: 'LoginController',
                templateUrl: 'templates/login.html'
            })
            .state('private', {
                abstract: true,
                url: '/',
                template: '<ui-view/>'
            })
            .state('private.lookup', {
                url: 'lookup/:query',
                // controller: 'MasterController',
                templateUrl: 'templates/lookup.html'
            })
            .state('private.coupons', {
                url: 'coupons',
                // controller: 'MasterController',
                templateUrl: 'templates/coupons.html'
            })
            .state('private.invites', {
                url: 'invites',
                // controller: 'MasterController',
                templateUrl: 'templates/invites.html'
            })
            .state('private.payments', {
                url: 'payments',
                // controller: 'MasterController',
                templateUrl: 'templates/payments.html'
            })
            .state('private.logs', {
                url: 'logs',
                // controller: 'MasterController',
                templateUrl: 'templates/logs.html'
            })
            .state('private.reports', {
                url: 'reports',
                // controller: 'MasterController',
                templateUrl: 'templates/reports.html'
            })
            .state('private.monitor', {
                url: 'monitor',
                // controller: 'MasterController',
                templateUrl: 'templates/monitor.html'
            })
            .state('private.messages', {
                url: 'messages',
                // controller: 'MasterController',
                templateUrl: 'templates/messages.html'
            })
            .state('private.blast', {
                url: 'blast',
                // controller: 'MasterController',
                templateUrl: 'templates/blast.html'
            })
            .state('private.multi-lookup', {
                url: 'multi-lookup',
                // controller: 'MasterController',
                templateUrl: 'templates/multi.html'
            })
            .state('private.admin-list', {
                url: 'admin-list',
                controller: 'AdminController',
                templateUrl: 'templates/admins.html'
            });
    }
]);
