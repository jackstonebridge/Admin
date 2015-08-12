/**
 * Master Controller
 */

angular
.module('RDash')
.controller('MasterCtrl', ['$scope', '$cookieStore', '$http', '$rootScope', '$state', MasterCtrl])
.filter("bytes", function () {
    return function(bytes, precision) {
        if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
        if (typeof precision === 'undefined') precision = 1;
        var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
            number = Math.floor(Math.log(bytes) / Math.log(1024));
        return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number];
    }
});

function MasterCtrl($scope, $cookieStore, $http, $rootScope, $state) {

    $http.defaults.headers.common['Content-Type'] = 'application/json;charset=utf-8';
    $http.defaults.headers.common['x-pm-appversion'] = 'Web_2.0.5';
    $http.defaults.headers.common['x-pm-apiversion'] = '1';
    $http.defaults.headers.common['Accept'] = 'application/vnd.protonmail.v1+json';

    $scope.user = {};
    $scope.advanced = false;
    $rootScope.loading = false;

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
        if (!$scope.isLoggedIn() && toState.name!=='index') {
            event.preventDefault(); 
            $state.go('index');
            return;
        }
    });

    /**
     * Sidebar Toggle & Cookie Control
     */
    var mobileView = 992;

    $scope.getWidth = function() {
        return window.innerWidth;
    };

    $scope.$watch($scope.getWidth, function(newValue, oldValue) {
        if (newValue >= mobileView) {
            if (angular.isDefined($cookieStore.get('toggle'))) {
                $scope.toggle = ! $cookieStore.get('toggle') ? false : true;
            } else {
                $scope.toggle = true;
            }
        } else {
            $scope.toggle = false;
        }

    });

    $scope.init = function() {
        var AT = $cookieStore.get('AT');
        var UID = $cookieStore.get('UID');
        var RF = $cookieStore.get('RF');
        if ((AT !== undefined) && (UID !== undefined)) {
            $http.defaults.headers.common['Authorization'] = 'Bearer '+AT;
            $http.defaults.headers.common['x-pm-uid'] = UID;
            if ($state.current.name==='') {
                var data = {
                    "ResponseType": "token",
                    "ClientID": "demoapp",
                    "GrantType": "refresh_token",
                    "RefreshToken": RF,
                    "RedirectURI": "http://protonmail.ch",
                    "State": "random_string"
                };
                $http.post('https://admin-api.protontech.ch/auth/refresh', data)
                .then(
                    function(response) {
                        $scope.user = response.data;
                        $http.defaults.headers.common['Authorization'] = 'Bearer '+response.data.AccessToken;
                        $http.defaults.headers.common['x-pm-uid'] = response.data.Uid;
                        $cookieStore.put('AT', response.data.AccessToken);
                        $cookieStore.put('UID', response.data.Uid);
                        $state.go('dashboard');
                    }
                );
            }
        }
    };

    $scope.toggleSidebar = function() {
        $scope.toggle = !$scope.toggle;
        $cookieStore.put('toggle', $scope.toggle);
    };

    window.onresize = function() {
        $scope.$apply();
    };

    $scope.isLoggedIn = function() {
        return ($scope.user.UserStatus !== undefined);
    }

    $scope.login = function() {
        var data = {
            "ResponseType": "token",
            "Username": this.username, // this referecnes the form object thats sent for ng-submit
            "Password": this.password,
            "ClientID": "demoapp",
            "ClientSecret": "demopass",
            "GrantType": "password",
            "RedirectURI": "http://protonmail.ch",
            "State": "random_string"
        };
        $rootScope.$emit('closeAlert', 0);

        $rootScope.loading = true;
        $http.post('https://admin-api.protontech.ch/auth', data)
        .then(
            function(response) {
                $rootScope.loading = false;
                var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
                if (error) {
                    $rootScope.$emit('addAlert', error);
                }                
                else {
                    $scope.user = response.data;
                    $http.defaults.headers.common['Authorization'] = 'Bearer '+response.data.AccessToken;
                    $http.defaults.headers.common['x-pm-uid'] = response.data.Uid;
                    $cookieStore.put('AT', response.data.AccessToken);
                    $cookieStore.put('UID', response.data.Uid);
                    $cookieStore.put('RF', response.data.RefreshToken);
                    $state.go('dashboard');
                }
            }, 
            function(response) {
                $rootScope.loading = false;
                // called asynchronously if an error occurs
            }
        );
    };

    $scope.logout = function() {
        $http.delete('https://admin-api.protontech.ch/auth')
        .then(
            function(response) {
                $rootScope.loading = false;
                var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
                if (error) {
                    $rootScope.$emit('addAlert', error);
                }
                else {
                    $scope.user = {};
                    $http.defaults.headers.common['Authorization'] = undefined;
                    $http.defaults.headers.common['x-pm-uid'] = undefined;
                    $cookieStore.remove('AT');
                    $cookieStore.remove('UID');
                    $cookieStore.remove('RF');
                    $state.go('index');
                }
            }, 
            function(response) {
                $rootScope.loading = false;
                // called asynchronously if an error occurs
            }
        );
        
    };

    $scope.lookup = function() {
        if (this.lookupString === undefined) {
            return;
        }
        var lookupString = this.lookupString.trim();
        if (lookupString==='') {
            return;
        }
        $rootScope.loading = true;
        $http.get('https://admin-api.protontech.ch/admin/lookup/'+escape(this.lookupString))
        .then(
            function(response) {
                $rootScope.loading = false;
                var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
                if (error) {
                    $rootScope.$emit('addAlert', error);
                }                
                else {
                    $scope.lookupResponse = response.data;
                }
            }, 
            function(response) {
                $rootScope.loading = false;
                // called asynchronously if an error occurs
            }
        );
    };

    $scope.init();
}