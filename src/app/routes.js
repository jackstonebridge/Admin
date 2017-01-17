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
        .state('private.blast', {
            url: 'blast',
            // controller: 'MasterController',
            templateUrl: 'templates/blast.html'
        })

        .state('private.lookup', {
            url: 'lookup/',
            controller: 'LookupController',
            controllerAs: 'vm',
            templateUrl: 'templates/admin/lookup.html'
        })
        .state('private.multilookup', {
            url: 'multilookup',
            controller: 'LookupController',
            controllerAs: 'vm',
            templateUrl: 'templates/admin/multilookup.html'
        })
        .state('private.lookupUser', {
            url: 'lookup/user/:query',
            controller: 'LookupController',
            controllerAs: 'vm',
            templateUrl: 'templates/admin/lookup.html'
        })
        .state('private.logs', {
            url: 'user/:query/logs',
            controller: 'LogController',
            controllerAs: 'vm',
            templateUrl: 'templates/admin/lookup/logs.html'
        })
        .state('private.payments', {
            url: 'user/:query/payments',
            controller: 'PaymentController',
            controllerAs: 'vm',
            templateUrl: 'templates/admin/lookup/payments.html'
        })
        .state('private.messages', {
            url: 'lookup/user/:query/messages',
            controller: 'LookupController',
            controllerAs: 'vm',
            templateUrl: 'templates/admin/lookup/messages.html'
        })
        .state('private.lookupOrganization', {
            url: 'lookup/organization/:query',
            controller: 'LookupController',
            controllerAs: 'vm',
            templateUrl: 'templates/admin/lookup.html'
        })
        .state('private.lookupDomain', {
            url: 'lookup/domain/:query',
            controller: 'LookupController',
            controllerAs: 'vm',
            templateUrl: 'templates/admin/lookup.html'
        })
        .state('private.lookupCharge', {
            url: 'lookup/charge/:query',
            controller: 'LookupController',
            controllerAs: 'vm',
            templateUrl: 'templates/admin/lookup.html'
        })
        .state('private.monitor', {
            url: 'monitor',
            controller: 'MonitorController',
            controllerAs: 'vm',
            templateUrl: 'templates/admin/monitor.html'
        })
        .state('private.invites', {
            url: 'invites',
            controller: 'InviteController',
            controllerAs: 'vm',
            templateUrl: 'templates/admin/invites.html'
        })
        .state('private.coupons', {
            url: 'coupons',
            controller: 'CouponController',
            controllerAs: 'vm',
            templateUrl: 'templates/admin/coupons.html'
        })
        .state('private.reports', {
            url: 'reports',
            controller: 'ReportController',
            controllerAs: 'vm',
            templateUrl: 'templates/admin/reports.html'
        })
        .state('private.referrers', {
            url: 'referrers',
            controller: 'ReferrerController',
            controllerAs: 'vm',
            templateUrl: 'templates/admin/referrers.html'
        })
        .state('private.admins', {
            url: 'admins',
            controller: 'AdminController',
            controllerAs: 'vm',
            templateUrl: 'templates/admin/admins.html'
        });
});
