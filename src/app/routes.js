angular.module('RDash')
.config(($stateProvider, $urlRouterProvider, $locationProvider) => {
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
        .state('index.logout', {
            url: '/logout'
        })
        .state('private', {
            abstract: true,
            url: '/',
            template: '<ui-view/>',
            onEnter($rootScope, userModel) {
                $rootScope.isLoggedIn = userModel.isLoggedIn();
                $rootScope.isLocked = userModel.isLocked();
                $rootScope.isSecure = userModel.isSecured();
            }
        })
        .state('private.lookup', {
            url: 'lookup/:query',
            // controller: 'MasterController',
            templateUrl: 'templates/lookup.html'
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


        .state('private.monitor', {
            url: 'monitor',
            controller: 'MonitorController',
            controllerAs: 'ctrl',
            templateUrl: 'templates/monitor.html'
        })
        .state('private.invites', {
            url: 'invites',
            controller: 'InviteController',
            controllerAs: 'ctrl',
            templateUrl: 'templates/invites.html'
        })
        .state('private.coupons', {
            url: 'coupons',
            controller: 'CouponController',
            controllerAs: 'ctrl',
            templateUrl: 'templates/coupons.html'
        })
        .state('private.reports', {
            url: 'reports',
            controller: 'ReportController',
            controllerAs: 'ctrl',
            templateUrl: 'templates/reports.html'
        })
        .state('private.referrers', {
            url: 'referrers',
            controller: 'ReferrerController',
            controllerAs: 'ctrl',
            templateUrl: 'templates/referrers.html'
        })
        .state('private.admins', {
            url: 'admins',
            controller: 'AdminController',
            controllerAs: 'ctrl',
            templateUrl: 'templates/admins.html'
        });
});
