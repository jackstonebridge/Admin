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
            .state('login', {
                url: '/login',
                views: {
                    'main@': {
                        templateUrl: 'templates/layout/login.tpl.html'
                    },
                    'panel@login': {
                        controller: 'LoginController',
                        templateUrl: 'templates/views/login.tpl.html'
                    }
                }
            })
            .state('hello', {
                url: '/hello',
                template: '<h1>Hello World</h1>'
            })
            .state('login.unlock', {
                url: '/unlock',
                views: {
                    'panel@login': {
                        controller: 'LoginController',
                        templateUrl: 'templates/views/unlock.tpl.html'
                    }
                }
            })

            .state('login.setup', {
                url: '/setup',
                views: {
                    'panel@login': {
                        controller: 'SetupController',
                        templateUrl: 'templates/views/setup.tpl.html'
                    }
                }
            })

            .state('login.sub', {
                url: '/sub',
                views: {
                    'panel@login': {
                        controller: 'LoginController',
                        templateUrl: 'templates/views/unlock.tpl.html'
                    }
                },
                onEnter: ($rootScope) => {
                    $rootScope.isLoggedIn = true;
                    $rootScope.domoArigato = true;
                }
            })

            .state('index', {
                url: '/',
                controller: 'LoginController',
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
            .state('invites', {
                url: '/invites',
                templateUrl: 'templates/invites.html'
            })
            .state('payments', {
                url: '/payments',
                templateUrl: 'templates/payments.html'
            })
            .state('logs', {
                url: '/logs',
                templateUrl: 'templates/logs.html'
            })
            .state('reports', {
                url: '/reports',
                templateUrl: 'templates/reports.html'
            })
            .state('monitor', {
                url: '/monitor',
                templateUrl: 'templates/monitor.html'
            })
            .state('messages', {
                url: '/messages',
                templateUrl: 'templates/messages.html'
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
