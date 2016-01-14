/**
 * Master Controller
 */
var DEBUG = true;

angular
.module('RDash')
.controller('MasterCtrl', ['$scope', '$http', '$rootScope', '$state', '$q', '$stateParams', '$log', '$location', '$timeout', MasterCtrl])
.filter("bytes", function () {
    "use strict";
    return function(bytes, precision) {
        if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) { return '-'; }
        if (typeof precision === 'undefined') { precision = 1; }
        var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
            number = Math.floor(Math.log(bytes) / Math.log(1024));
        return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number];
    };
})
.directive('ngConfirmClick', [
  function(){
    "use strict";
    return {
      priority: -1,
      restrict: 'A',
      link: function(scope, element, attrs){
        element.bind('click', function(e){
          var message = attrs.ngConfirmClick;
          if(message && !confirm(message)){
            e.stopImmediatePropagation();
            e.preventDefault();
          }
        });
      }
    };
  }
])
.factory('myHttpInterceptor', function() {
    "use strict";
    return {
        response: function(response) {
            return response;
        }
    };
})
.config(['$httpProvider', function ($httpProvider) {
    "use strict";
    $httpProvider.interceptors.push('myHttpInterceptor');
}]);

function MasterCtrl($scope, $http, $rootScope, $state, $q, $stateParams, $log, $location, $timeout)
{
    "use strict";

    var apiUrl = 'https://admin-api.protontech.ch';
    // var apiUrl = 'https://test-api.protonmail.ch';
    var appVersion   = 'Other';
    var clientId     = 'B0SS';
    var clientSecret = 'c916d8e8712f96c719acab4ec54e7844';

    if ( DEBUG )
    {
        apiUrl       = "https://protonmail.local.dev/api";
        // appVersion   = "Other";
        // clientId     = "demoapp";
        // clientSecret = "demopass";
    }

    $http.defaults.headers.common['Content-Type'] = 'application/json;charset=utf-8';
    $http.defaults.headers.common['x-pm-appversion'] = appVersion;
    $http.defaults.headers.common['x-pm-apiversion'] = '1';
    $http.defaults.headers.common['Accept'] = 'application/vnd.protonmail.v1+json';

    $scope.user = {};
    $scope.advanced = false;
    $rootScope.loading = false;
    $scope.forceMonitorFlag = false;
    $scope.blastMode = false;

    $scope.template = false;

    var AT = sessionStorage.getItem('AT');

    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {

        // console.log(!$scope.isLoggedIn(), (toState.name!=='index'), AT);

        if (!$scope.isLoggedIn() && toState.name!=='index' && !AT) {
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
            if (angular.isDefined(sessionStorage.getItem('toggle'))) {
                $scope.toggle = ! sessionStorage.getItem('toggle') ? false : true;
            } else {
                $scope.toggle = true;
            }
        } else {
            $scope.toggle = false;
        }

    });

    $scope.init = function() {
        var AT = sessionStorage.getItem('AT');
        var UID = sessionStorage.getItem('UID');
        var RF = sessionStorage.getItem('RF');
        var UN = sessionStorage.getItem('UN');
        $scope.showLogin = false;
        if (AT && UID) {
            // console.log(AT, UID, RF, UN);
            $http.defaults.headers.common['Authorization'] = 'Bearer '+AT;
            $http.defaults.headers.common['x-pm-uid'] = UID;
            if ($state.current.name==='') {
                var data = {
                    "ResponseType": "token",
                    "ClientID": clientId,
                    "GrantType": "refresh_token",
                    "RefreshToken": RF,
                    "RedirectURI": "http://protonmail.ch",
                    "State": "random_string"
                };
                $http.post(apiUrl+'/auth/refresh', data)
                .then(
                    function(response) {
                        $scope.user = response.data;
                        $scope.user.Name = UN;
                        $http.defaults.headers.common['Authorization'] = 'Bearer '+response.data.AccessToken;
                        $http.defaults.headers.common['x-pm-uid'] = response.data.Uid;
                        sessionStorage.setItem('AT', response.data.AccessToken);
                        sessionStorage.setItem('UID', response.data.Uid);
                        if ($state.current.name === 'index') {
                            $state.go('lookup');
                        }
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
        if ($state.params.query!==undefined) {
            $scope.lookup($state.params.query);
        }

        // Determine lookup query and template
        var hash = $location.$$path.replace('/lookup/', '');

        var template = hash.split('=')[0];
        var query    = hash.split('=')[1];

        if ( DEBUG )
        {
            console.debug("Reading hash: "     + hash);
            console.debug("Reading template: " + template);
            console.debug("Reading query: "    + query);
        }

        if ( query    !== undefined && query    !== '' && query    !== '/' &&
             template !== undefined && template !== '' && template !== '/' )
        {
            $timeout(
                function()
                {
                    $scope.lookupString = query;
                    $scope.lookup(template, query);
                },
                1000
            );
        }
    };

    $scope.toggleSidebar = function() {
        $scope.toggle = !$scope.toggle;
        sessionStorage.setItem('toggle', $scope.toggle);
    };

    window.onresize = function() {
        $scope.$apply();
    };

    $scope.isLoggedIn = function() {
        return ($scope.user.UserStatus !== undefined);
    };

    $scope.login = function() {

        var username = this.username;

        var data = {
            "ResponseType": "token",
            "Username": this.username, // this referecnes the form object thats sent for ng-submit
            "Password": this.password,
            "ClientID": clientId,
            "ClientSecret": clientSecret,
            "GrantType": "password",
            "RedirectURI": "http://protonmail.ch",
            "State": "random_string"
        };
        $rootScope.$emit('closeAlert', 0);

        $rootScope.loading = true;
        $http.post(apiUrl+'/auth', data)
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
                    sessionStorage.setItem('AT', response.data.AccessToken);
                    sessionStorage.setItem('UID', response.data.Uid);
                    sessionStorage.setItem('RF', response.data.RefreshToken);
                    sessionStorage.setItem('UN', username);
                    $state.go('lookup');
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

        $rootScope.loading = true;

        $http.delete(apiUrl+'/auth')
        .then(
            function(response) {
                $rootScope.loading = false;
                var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
                if (error) {
                    $rootScope.$emit('addAlert', error);
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
        $scope.user = {};
        $http.defaults.headers.common['Authorization'] = undefined;
        $http.defaults.headers.common['x-pm-uid'] = undefined;
        sessionStorage.clear();
        $scope.showLogin = true;
        $state.go('index');
        window.location.reload();

    };

    $scope.adminList = function() {
        $rootScope.loading = true;
        $http.get(apiUrl+'/admin/admins')
        .then(
            function(response) {
                $rootScope.loading = false;
                var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
                if (error) {
                    $rootScope.$emit('addAlert', error);
                }
                else {
                    $scope.Admins = response.data.Admins;
                    $scope.Supers = response.data.Supers;
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

    $scope.initInfo = function() {
        $scope.lookupResponse = [];
    };

    $scope.setLookupTemplate = function(path)
    {
        if (path === "user"         ||
            path === "domain"       ||
            path === "organization"    )
        {
            $scope.template = "templates/_" + path + ".html";
        }
    };

    $scope.lookup = function(template, query)
    {
        var lookupString, lookupTemplate;

        if (template === undefined) { return; }
        else
        {
            lookupTemplate = template;
            this.setLookupTemplate(template);
        }

        if (query === undefined)
        {
            if (this.lookupString === undefined) { return; }
            lookupString = this.lookupString.trim();
            // Set the scope lookupString to the current search
            $scope.lookupString = lookupString;
        }
        else
        {
            lookupString = query;
        }

        // Debug
        if ( DEBUG )
        {
            console.debug("MasterCtrl.lookup: lookupTemplate      = " + lookupTemplate);
            console.debug("MasterCtrl.lookup: lookupString        = " + lookupString);
            console.debug("MasterCtrl.lookup: this.lookupString   = " + this.lookupString);
            console.debug("MasterCtrl.lookup: $scope.lookupString = " + $scope.lookupString);
        }

        window.location.hash = '#/lookup/' + lookupTemplate + '=' + lookupString;

        $rootScope.loading = true;
        $scope.lookupResponse = [];

        // Call backend route
        $http.get( apiUrl + '/admin/lookup/' + escape(lookupTemplate) + '/' + escape(lookupString) )
        .then(
            function(response)
            {
                $rootScope.loading = false;
                var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
                if (error) {
                    $rootScope.$emit('addAlert', error);
                }
                else {
                    // if empty we say "No info found."
                    if (
                        response.data.Results &&
                        response.data.Results.length === 0
                    ) {
                        $rootScope.$emit('addAlert', 'No information found');
                    }
                    $scope.lookupResponse.push(response.data);
                }
            },
            function(response)
            {
                $rootScope.loading = false;
                $rootScope.$emit('addAlert', response);
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

        $rootScope.loading = true;

        $http.put(apiUrl+'/admin/user/'+this.accountID+'/noticeemail', data)
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

    $scope.changeInviteEmail = function() {

        var data =  {
            "Email": this.Email
        };

        $rootScope.loading = true;

        $http.put(apiUrl+'/admin/invite/'+this.accountID+'/email', data)
        .then(
            function(response) {
                $rootScope.loading = false;
                var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
                if (error) {
                    $rootScope.$emit('addAlert', error);
                }
                else {
                    $rootScope.$emit('addAlert', 'Invite Email Updated.');
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

    $scope.sendInvite = function() {

        $rootScope.loading = true;

        $http.post(apiUrl+'/admin/invite/'+this.accountID+'/send')
        .then(
            function(response) {
                $rootScope.loading = false;
                var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
                if (error) {
                    $rootScope.$emit('addAlert', error);
                }
                else {
                    $rootScope.$emit('addAlert', 'Invite Sent for '+$scope.lookupString);
                    $scope.lookupResponse = [];
                    $scope.lookupString = '';
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
    };

    $scope.forceMonitor = function() {
        $scope.forceMonitorFlag = true;
        $scope.monitor();
    };

    $scope.monitor = function() {

        if ($scope.monitorAccounts && !$scope.forceMonitorFlag) { return; }

        // $http.get('/monitor.json')
        $rootScope.loading = true;
        $scope.monitorAccounts = '';
        $scope.TotalUnread = '';
        $http.get(apiUrl+'/admin/monitor')
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

        $rootScope.loading = true;

        $http.put(apiUrl+'/admin/user/'+this.accountID+'/password', data)
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

        $rootScope.loading = true;

        $http.put(apiUrl+'/admin/user/'+this.accountID+'/logout')
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

        $rootScope.loading = true;

        $http.delete(apiUrl+'/admin/user/'+this.accountID)
        .then(
            function(response) {
                $rootScope.loading = false;
                var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
                if (error) {
                    $rootScope.$emit('addAlert', error);
                }
                else {
                    $rootScope.$emit('addAlert', 'Deleted from Active Users.');
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

    $scope.blast= function() {

        var papaBlastList = Papa.parse(this.blastList);
        var List = [];

        for(var i = 0; i < papaBlastList.data.length; i++) {
            var email = papaBlastList.data[i][0];
            List.push(email);
        }

        var data =  {
            "Subject"   : this.blastSubject,
            "Body"      : this.blastMessage,
            "Except"    : this.blastMode,
            "Usernames" : List,
        };

        $scope.blastData = data;

        $rootScope.loading = true;

        $http.post(apiUrl+'/admin/blast', data)
        .then(
            function(response) {
                $rootScope.loading = false;
                var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
                if (error) {
                    $rootScope.$emit('addAlert', error);
                }
                else {
                    if (response.data.Responses.length === 0) {
                        $rootScope.$emit('addAlert', 'Message Blast Sent. No errors!');
                    }
                    else {
                        var message = '';
                        response.data.Responses.forEach( function(rsp) {
                            message += '<p>'+rsp.Error+': <code>'+rsp.ErrorDescription+'</code></p>';
                        });
                        $rootScope.$emit('addAlert', message);
                    }

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

    $scope.deleteUserWL = function() {

        $rootScope.loading = true;

        $http.delete(apiUrl+'/admin/invite/'+this.accountID)
        .then(
            function(response) {
                $rootScope.loading = false;
                var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
                if (error) {
                    $rootScope.$emit('addAlert', error);
                }
                else {
                    $rootScope.$emit('addAlert', 'Deleted from Waiting List.');
                    $scope.lookupResponse.Results = 'undefined';
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

    $scope.changeStatus = function(action) {

        $rootScope.loading = true;

        if (action === 0) {
            $http.put(apiUrl+'/admin/user/'+this.accountID+'/disable')
            .then(
                function(response) {
                    $rootScope.loading = false;
                    var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
                    if (error) {
                        $rootScope.$emit('addAlert', error);
                    }
                    else {
                        $rootScope.$emit('addAlert', 'User Disabled.');
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
        }
        else if (action === 2) {
            $http.put(apiUrl+'/admin/user/'+this.accountID+'/enable')
            .then(
                function(response) {
                    $rootScope.loading = false;
                    var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
                    if (error) {
                        $rootScope.$emit('addAlert', error);
                    }
                    else {
                        $rootScope.$emit('addAlert', 'User Enabled.');
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
        }
        else if (action === 3) {
            $http.put(apiUrl+'/admin/user/'+this.accountID+'/admin')
            .then(
                function(response) {
                    $rootScope.loading = false;
                    var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
                    if (error) {
                        $rootScope.$emit('addAlert', error);
                    }
                    else {
                        $rootScope.$emit('addAlert', 'User is now ADMIN.');
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
        }

    };

    $scope.changeLevel = function(level) {
        $rootScope.loading = true;

        var data = {
            "Level": level
        };

        $http.put(apiUrl+'/admin/user/'+this.accountID+'/level', data)
        .then(
            function(response) {
                $rootScope.loading = false;
                var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
                if (error) {
                    $rootScope.$emit('addAlert', error);
                }
                else {
                    $rootScope.$emit('addAlert', 'Level changed.');
                    $scope.lookupResponse.Results = 'undefined';
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

    // CSV MultiLookup Parsing
    $scope.multilookup = function(template)
    {
        var promises = [];
        this.setLookupTemplate(template);
        $scope.debugJSON = Papa.parse(this.csvData);
        $rootScope.loading = true;

        for(var i = 0; i < $scope.debugJSON.data.length; i++)
        {
            var query = $scope.debugJSON.data[i][0];

            var suffix = '';
            suffix += '/' + escape(template);
            suffix += '/' + escape(query);

            var promise = $http.get( apiUrl + '/admin/lookup' + suffix )
            .then(
                function(response) {
                    return response.data;
                }
            );
            promises.push(promise);
        }

        $q.all(promises)
        .then(
            function(response) {
                $scope.lookupResponse = response;
                $rootScope.loading = false;
            }
        );
    };

    $scope.init();
}
