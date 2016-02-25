'use strict';

/**
 * Route configuration for the RDash module.
 */
angular.module('RDash').config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

        // For unmatched routes
        $urlRouterProvider.otherwise('/');

        // Application routes
        $stateProvider
            .state('index', {
                url: '/',
                templateUrl: 'templates/login.html'
            })
            .state('lookup', {
                url: '/lookup/:query',
                templateUrl: 'templates/lookup.html'
            })
            .state('coupons', {
                url: '/coupons',
                templateUrl: 'templates/coupons.html'
            })
            .state('payments', {
                url: '/payments',
                templateUrl: 'templates/payments.html'
            })
            .state('monitor', {
                url: '/monitor',
                templateUrl: 'templates/monitor.html'
            })
            .state('blast', {
                url: '/blast',
                templateUrl: 'templates/blast.html'
            })
            .state('multi-lookup', {
                url: '/multi-lookup',
                templateUrl: 'templates/multi.html'
            })
            .state('admin-list', {
                url: '/admin-list',
                templateUrl: 'templates/admins.html'
            });
    }
]);
