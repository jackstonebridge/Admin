/**
 * Master Controller
 */

angular
.module('RDash')
.controller('MasterCtrl', ['$scope', '$cookieStore', '$http', '$rootScope', '$state', '$q', MasterCtrl])
.filter("bytes", function () {
    return function(bytes, precision) {
        if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
        if (typeof precision === 'undefined') precision = 1;
        var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
            number = Math.floor(Math.log(bytes) / Math.log(1024));
        return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number];
    }
});

function MasterCtrl($scope, $cookieStore, $http, $rootScope, $state, $q) {

    $http.defaults.headers.common['Content-Type'] = 'application/json;charset=utf-8';
    $http.defaults.headers.common['x-pm-appversion'] = 'Web_2.0.5';
    $http.defaults.headers.common['x-pm-apiversion'] = '1';
    $http.defaults.headers.common['Accept'] = 'application/vnd.protonmail.v1+json';

    $scope.user = {};
    $scope.advanced = false;
    $rootScope.loading = false;
    $scope.forceMonitorFlag = false;

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
        var UN = $cookieStore.get('UN');
        $scope.showLogin = false;
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
                        $scope.user.Name = UN;
                        $http.defaults.headers.common['Authorization'] = 'Bearer '+response.data.AccessToken;
                        $http.defaults.headers.common['x-pm-uid'] = response.data.Uid;
                        $cookieStore.put('AT', response.data.AccessToken);
                        $cookieStore.put('UID', response.data.Uid);
                        $state.go('dashboard');
                    },
                    function(response) {
                        if (error) {
                            $rootScope.$emit('addAlert', response);
                        }
                    }
                );
            }
        }
        else {
            $scope.showLogin = true;
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

        var username = this.username;

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
                    $scope.user.Name = username;
                    $http.defaults.headers.common['Authorization'] = 'Bearer '+response.data.AccessToken;
                    $http.defaults.headers.common['x-pm-uid'] = response.data.Uid;
                    $cookieStore.put('AT', response.data.AccessToken);
                    $cookieStore.put('UID', response.data.Uid);
                    $cookieStore.put('RF', response.data.RefreshToken);
                    $cookieStore.put('UN', username);
                    $state.go('dashboard');
                }
            }, 
            function(response) {
                $rootScope.loading = false;
                if (error) {
                    $rootScope.$emit('addAlert', response);
                }
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
                    $scope.showLogin = true;
                    $state.go('index');
                    window.location.reload();
                }
            }, 
            function(response) {
                $rootScope.loading = false;
                if (error) {
                    $rootScope.$emit('addAlert', response);
                }
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
        $scope.lookupResponse = '';
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
                if (error) {
                    $rootScope.$emit('addAlert', response);
                }
                // called asynchronously if an error occurs
            }
        );
    };

    $scope.randPass = function() {
        return Math.random().toString(36).slice(-8)+''+Math.random().toString(36).slice(-8);
    };

    $scope.changeNotificationEmail = function() {

        var data =  {
            "NotificationEmail": this.accountNotfEmail
        };

        $http.put('https://admin-api.protontech.ch/admin/user/'+this.accountID+'/noticeemail', data)
        .then(
            function(response) {
                $rootScope.loading = false;
                var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
                if (error) {
                    $rootScope.$emit('addAlert', error);
                }                
                else {
                    $rootScope.$emit('addAlert', 'Notf. Email Updated.');
                }
            }, 
            function(response) {
                $rootScope.loading = false;
                if (error) {
                    $rootScope.$emit('addAlert', response);
                }
                // called asynchronously if an error occurs
            }
        );        
    };

    $scope.getTotalUnread = function() {
        var total = 0;
        angular.forEach($scope.monitorAccounts.data.Accounts, function(value, key) {
            total += value.Total;
        });
        return total;
    }

    $scope.forceMonitor = function() {
        $scope.forceMonitorFlag = true;
        $scope.monitor();
    };

    $scope.monitor = function() {

        if ($scope.monitorAccounts && !$scope.forceMonitorFlag) return;

        // $http.get('/monitor.json')
        $rootScope.loading = true;
        $scope.monitorAccounts = '';
        $scope.TotalUnread = '';
        $http.get('https://admin-api.protontech.ch/admin/monitor')
        .then(
            function(response) {
                $rootScope.loading = false;
                var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
                if (error) {
                    $rootScope.$emit('addAlert', error);
                }                
                else {
                    $scope.monitorAccounts = response;
                    $scope.TotalUnread = $scope.getTotalUnread();
                }
                $scope.forceMonitorFlag = false;
            }, 
            function(response) {
                $rootScope.loading = false;
                if (error) {
                    $rootScope.$emit('addAlert', response);
                }
                $scope.forceMonitorFlag = false;
                // called asynchronously if an error occurs
            }
        );        
    };

    $scope.updateLoginPassword = function() {

        var data =  {
            "Password": this.newLoginPass
        };

        $http.put('https://admin-api.protontech.ch/admin/user/'+this.accountID+'/password', data)
        .then(
            function(response) {
                $rootScope.loading = false;
                var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
                if (error) {
                    $rootScope.$emit('addAlert', error);
                }                
                else {
                    $rootScope.$emit('addAlert', 'Password Updated.');
                }
            }, 
            function(response) {
                $rootScope.loading = false;
                if (error) {
                    $rootScope.$emit('addAlert', response);
                }
                // called asynchronously if an error occurs
            }
        );        
    };

    $scope.logoutUser = function() {

        $http.put('https://admin-api.protontech.ch/admin/user/'+this.accountID+'/logout')
        .then(
            function(response) {
                $rootScope.loading = false;
                var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
                if (error) {
                    $rootScope.$emit('addAlert', error);
                }                
                else {
                    $rootScope.$emit('addAlert', 'User Logged Out.');
                }
            }, 
            function(response) {
                $rootScope.loading = false;
                if (error) {
                    $rootScope.$emit('addAlert', response);
                }
                // called asynchronously if an error occurs
            }
        );        
    };

    $scope.deleteUserAU = function() {

        $http.delete('https://admin-api.protontech.ch/admin/user/'+this.accountID)
        .then(
            function(response) {
                $rootScope.loading = false;
                var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
                if (error) {
                    $rootScope.$emit('addAlert', error);
                }                
                else {
                    $rootScope.$emit('addAlert', 'Deleted from Active Users.');
                    $scope.lookupResponse.Users = undefined;
                }
            }, 
            function(response) {
                $rootScope.loading = false;
                if (error) {
                    $rootScope.$emit('addAlert', response);
                }
                // called asynchronously if an error occurs
            }
        );        
    };

    $scope.changeStatus = function(action, account) {

        // action: 0,2,3
        if (action==0) {
            $http.put('https://admin-api.protontech.ch/admin/user/'+this.accountID+'/disable')
            .then(
                function(response) {
                    $rootScope.loading = false;
                    var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
                    if (error) {
                        $rootScope.$emit('addAlert', error);
                    }                
                    else {
                        $rootScope.$emit('addAlert', 'User Disabled.');
                    }
                }, 
                function(response) {
                    $rootScope.loading = false;
                    if (error) {
                        $rootScope.$emit('addAlert', response);
                    }
                    // called asynchronously if an error occurs
                }
            );  
        }
        else if (action==2) {
            $http.put('https://admin-api.protontech.ch/admin/user/'+this.accountID+'/enable')
            .then(
                function(response) {
                    $rootScope.loading = false;
                    var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
                    if (error) {
                        $rootScope.$emit('addAlert', error);
                    }                
                    else {
                        $rootScope.$emit('addAlert', 'User Enabled.');
                    }
                }, 
                function(response) {
                    $rootScope.loading = false;
                    if (error) {
                        $rootScope.$emit('addAlert', response);
                    }
                    // called asynchronously if an error occurs
                }
            );  
        }
        else if (action==3) {
            $http.put('https://admin-api.protontech.ch/admin/user/'+this.accountID+'/admin')
            .then(
                function(response) {
                    $rootScope.loading = false;
                    var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
                    if (error) {
                        $rootScope.$emit('addAlert', error);
                    }                
                    else {
                        $rootScope.$emit('addAlert', 'User is now ADMIN.');
                    }
                }, 
                function(response) {
                    $rootScope.loading = false;
                    if (error) {
                        $rootScope.$emit('addAlert', response);
                    }
                    // called asynchronously if an error occurs
                }
            );  
        }
      
    };

    // CSV Debug Parsing
    $scope.debug = function() {

        var promises = [];
        $scope.debugJSON = Papa.parse(this.csvData);
        $rootScope.loading = true;

        for(var i = 0; i < $scope.debugJSON.data.length; i++) {
            var query = $scope.debugJSON.data[i][0];
            var promise = $http.get('https://admin-api.protontech.ch/admin/lookup/'+escape(query))
            .then( 
                function(response) {
                    return response;
                }
            );
            promises.push(promise);
        } 

        $q.all(promises)
        .then( 
            function(response) {
                $scope.debugData = response;
                $rootScope.loading = false;
            }
        )

    };

    $scope.init();
}