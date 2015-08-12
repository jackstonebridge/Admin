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
            .state('dashboard', {
                url: '/dashboard',
                templateUrl: 'templates/lookup.html'
            })
            .state('monitor', {
                url: '/monitor',
                templateUrl: 'templates/monitor.html'
            })
            .state('blast', {
                url: '/blast',
                templateUrl: 'templates/blast.html'
            })
            .state('debug', {
                url: '/debug',
                templateUrl: 'templates/debug.html'
            });
    }
]);