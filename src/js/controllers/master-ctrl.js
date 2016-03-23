/**
 * Master Controller
 */
angular
.module('RDash')
.controller('MasterCtrl', ['$scope', '$http', '$rootScope', '$state', '$q', '$stateParams', '$log', '$location', '$timeout', 'Setup', MasterCtrl])
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

function MasterCtrl($scope, $http, $rootScope, $state, $q, $stateParams, $log, $location, $timeout, Setup)
{
    "use strict";

    var apiUrl       = Setup.apiUrl;
    var appVersion   = Setup.appVersion;
    var clientId     = Setup.clientId;
    var clientSecret = Setup.clientSecret;

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

    $scope.fuzzyOptions = [
        { label: "Fuzzy match: OFF"  , value: 0 },
        { label: "Fuzzy match: RIGHT", value: 1 },
        { label: "Fuzzy match: LEFT" , value: 2 },
        { label: "Fuzzy match: ALL"  , value: 3 }
    ];
    $scope.currentFuzzyOption = $scope.fuzzyOptions[0];

    $scope.deleteUserOptions = [
        { label: "Soft delete"  , value: 0 },
        { label: "Forced delete", value: 1 },
        { label: "Never existed", value: 2 }
    ];
    $scope.currentDeleteUserOption = $scope.deleteUserOptions[0];

    var AT = sessionStorage.getItem('AT');

    $rootScope.$on('$stateChangeStart', function(event, toState) {

        if (Setup.debug)
        {
            console.debug("(isLoggedIn(), isIndex(), AT) = " + !$scope.isLoggedIn(), (toState.name!=='index'), AT);
        }

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
            if (Setup.debug)
            {
                console.log(AT, UID, RF, UN);
            }
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
                        if (response) {
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

        if (Setup.debug)
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
                if (response) {
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
                if (response) {
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
                if (response) {
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

        if (Setup.debug)
        {
            console.debug("MasterCtrl.lookup: lookupTemplate      = " + lookupTemplate);
            console.debug("MasterCtrl.lookup: lookupString        = " + lookupString);
            console.debug("MasterCtrl.lookup: this.lookupString   = " + this.lookupString);
            console.debug("MasterCtrl.lookup: $scope.lookupString = " + $scope.lookupString);
            console.debug("MasterCtrl.lookup: $scope.currentFuzzyOption.value = " + this.currentFuzzyOption.value);
        }

        window.location.hash = '#/lookup/' + lookupTemplate + '=' + lookupString + '?fuzzy=' + this.currentFuzzyOption.value;

        $rootScope.loading = true;
        $scope.lookupResponse = [];

        // Call backend route
        $http.get( apiUrl + '/admin/lookup/' + escape(lookupTemplate) + '/' + escape(lookupString) + '?fuzzy=' + this.currentFuzzyOption.value )
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
                    $rootScope.$emit('addAlert', 'Notification email updated.');
                }
            },
            function(response) {
                $rootScope.loading = false;
                if (response) {
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
                if (response) {
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
                if (response) {
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
                if (response) {
                    $rootScope.$emit('addAlert', response);
                }
                $scope.forceMonitorFlag = false;
                // called asynchronously if an error occurs
            }
        );
    };

    $scope.checkSpam = function() {
        // window.location.hash = "#/messages/" + this.accountID;
        // window.location.reload();
        // $scope.spamUserID = this.accountID;
        window.open("#/messages?UserID=" + this.accountID, "_self");
    }

    $scope.forceMessages = function() {
        $scope.forceMessagesFlag = true;
        $scope.getUserMessages();
    };

    $scope.getUserMessages = function(location) {

        $rootScope.loading = true;
        $scope.messagesResponse = '';

        var UserID = $location.absUrl().split('?UserID=')[1];

        console.debug(UserID);
        $http.get(apiUrl + '/admin/user/' + UserID + '/messages?Location=' + location + '&Page=' + this.Page + '&PageSize=' + this.PageSize + '&Unread=' + this.Unread)
        .then(
            function(response) {
                $rootScope.loading = false;
                var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
                if (error) {
                    $rootScope.$emit('addAlert', error);
                }
                else {
                    $scope.messagesResponse = response;
                }
                $scope.forceMessagesFlag = false;
            },
            function(response) {
                $rootScope.loading = false;
                if (response) {
                    $rootScope.$emit('addAlert', response);
                }
                $scope.forceMessagesFlag = false;
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
                if (response) {
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
                if (response) {
                    $rootScope.$emit('addAlert', response);
                }
                // called asynchronously if an error occurs
            }
        );
    };

    $scope.deleteUserAU = function()
    {
        $rootScope.loading = true;
        var delete_url = apiUrl + '/admin/user/' + this.accountID + '?Force=' + this.currentDeleteUserOption.value;

        $http.delete(delete_url)
        .then(
            function(response) {
                $rootScope.loading = false;
                var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
                if (error) {
                    $rootScope.$emit('addAlert', error);
                }
                else {
                    $rootScope.$emit('addAlert', 'Deleted from Active Users.');
                    window.location.reload();
                }
            },
            function(response) {
                $rootScope.loading = false;
                if (response) {
                    $rootScope.$emit('addAlert', response);
                }
                // called asynchronously if an error occurs
            }
        );
    };

    $scope.blast = function() {

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
                if (response) {
                    $rootScope.$emit('addAlert', response);
                }
            }
        );
    };

    $scope.deleteUserWL = function() {

        $rootScope.loading = true;

        $http.delete(apiUrl+'/admin/invite/' + this.accountID)
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
                    window.location.reload();
                }
            },
            function(response) {
                $rootScope.loading = false;
                if (response) {
                    $rootScope.$emit('addAlert', response);
                }
            }
        );
    };

    $scope.deleteOrganization = function()
    {
        $rootScope.loading = true;

        $http.delete(apiUrl+'/admin/organization/' + this.accountID)
        .then(
            function(response)
            {
                $rootScope.loading = false;
                var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
                if (error) {
                    $rootScope.$emit('addAlert', error);
                }
                else {
                    $rootScope.$emit('addAlert', 'Organization deleted.');
                    $scope.lookupResponse.Results = 'undefined';
                    window.location.reload();
                }
            },
            function(response) {
                $rootScope.loading = false;
                if (response) {
                    $rootScope.$emit('addAlert', response);
                }
            }
        );
    };

    $scope.deletePaymentsCustomer = function()
    {
        $rootScope.loading = true;

        $http.delete(apiUrl + '/admin/payments/customer/' + this.accountID)
        .then(
            function(response)
            {
                $rootScope.loading = false;
                var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
                if (error) {
                    $rootScope.$emit('addAlert', error);
                }
                else {
                    $rootScope.$emit('addAlert', 'Payment method deleted.');
                    $scope.lookupResponse.Results = 'undefined';
                    window.location.reload();
                }
            },
            function errorCallback(response) {
                $rootScope.loading = false;
                if (response) {
                    $rootScope.$emit('addAlert', response);
                }
            }
        );
    };

    $scope.deletePaymentsMethod = function(PaymentMethodID)
    {
        $rootScope.loading = true;

        $http.delete(apiUrl + '/admin/payments/method/' + this.accountID + '?PaymentMethodID=' +  PaymentMethodID)
        .then(
            function(response)
            {
                $rootScope.loading = false;
                var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
                if (error) {
                    $rootScope.$emit('addAlert', error);
                }
                else {
                    $rootScope.$emit('addAlert', 'Customer deleted.');
                    $scope.lookupResponse.Results = 'undefined';
                    window.location.reload();
                }
            },
            function errorCallback(response) {
                $rootScope.loading = false;
                if (response) {
                    $rootScope.$emit('addAlert', response);
                }
            }
        );
    };

    $scope.creditUser = function(UserID, Credit)
    {
        $rootScope.loading = true;

        var data = {
            "Credit": Credit * 100,
            "Description": "Admin panel credit adjustment"
        };

        $http.put(apiUrl + '/admin/user/' + UserID + '/credit', data)
        .then(
            function successCallback(response)
            {
                $rootScope.loading = false;
                var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
                if (error) {
                    $rootScope.$emit('addAlert', error);
                }
                else {
                    $rootScope.$emit('addAlert', 'Changed credit ' + Credit + ' of user ' + UserID + '.');
                    $scope.lookupResponse.Results = 'undefined';
                    window.location.reload();
                }
            },
            function errorCallback(response) {
                $rootScope.loading = false;
                if (response) {
                    $rootScope.$emit('addAlert', response);
                }
            }
        );
    };

    $scope.listCoupons = function(CouponCode)
    {
        $rootScope.loading = true;
        var param = (CouponCode === undefined) ? '' : '/' + CouponCode;
        $http.get(apiUrl + '/admin/coupons' + param)
        .then(
            function successCallback(response)
            {
                $rootScope.loading = false;
                var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
                if (error) {
                    $rootScope.$emit('addAlert', error);
                }
                else {
                    $scope.Coupons = response.data.Coupons;
                }
            },
            function errorCallback(response) {
                $rootScope.loading = false;
                if (response) {
                    $rootScope.$emit('addAlert', response);
                }
            }
        );
    };

    $scope.listSubscriptions = function(CreateTime)
    {
        $rootScope.loading = true;
        var param = (CreateTime === undefined) ? new Date().getTime() : CreateTime;
        $http.get(apiUrl + '/admin/payments/' + param)
        .then(
            function successCallback(response)
            {
                $rootScope.loading = false;
                var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
                if (error) {
                    $rootScope.$emit('addAlert', error);
                }
                else {
                    $scope.Subscriptions = response.data;
                }
            },
            function errorCallback(response) {
                $rootScope.loading = false;
                if (response) {
                    $rootScope.$emit('addAlert', response);
                }
            }
        );
    };

    $scope.listCoupon = function(couponName)
    {
        $rootScope.loading = true;
        $scope.CouponName = couponName;
        $rootScope.loading = false;
    }

    $scope.listCouponWhitelist = function(couponName)
    {
        $rootScope.loading = true;
        if ($scope.CouponName !== couponName) {
            $scope.CouponHistory = undefined;
        }
        $scope.CouponName = couponName;
        $http.get(apiUrl + '/admin/coupons/' + $scope.CouponName + '/whitelist')
        .then(
            function successCallback(response)
            {
                $rootScope.loading = false;
                var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
                if (error) {
                    $rootScope.$emit('addAlert', error);
                }
                else {
                    $scope.CouponWhitelist = response.data;
                }
            },
            function errorCallback(response) {
                $rootScope.loading = false;
                if (response) {
                    $rootScope.$emit('addAlert', response);
                }
            }
        );
    };

    $scope.addUserCouponWhitelist = function(couponName, couponInputData)
    {
        $rootScope.loading = true;

        var parsedInputData = Papa.parse(couponInputData);
        var userIDs = [];

        for(var i = 0; i < parsedInputData.data.length; i++)
        {
            userIDs.push(parsedInputData.data[i][0]);
        }

        var data = {
            "UserIDs": userIDs
        };

        $http.put(apiUrl + '/admin/coupons/' + couponName + '/whitelist', data)
        .then(
            function(response)
            {
                $rootScope.loading = false;
                var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
                if (error) {
                    $rootScope.$emit('addAlert', error);
                }
                else {
                    $rootScope.$emit('addAlert', 'Added to whitelist.');
                    $scope.listCouponWhitelist(couponName)
                }
            },
            function(response) {
                $rootScope.loading = false;
                if (response) {
                    $rootScope.$emit('addAlert', response);
                }
            }
        );
    };

    $scope.listCouponHistory = function(couponName)
    {
        $rootScope.loading = true;
        if ($scope.CouponName !== couponName) {
            $scope.CouponWhitelist = undefined;
        }
        $scope.CouponName = couponName;
        $http.get(apiUrl + '/admin/coupons/' + $scope.CouponName + '/history')
        .then(
            function successCallback(response)
            {
                $rootScope.loading = false;
                var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
                if (error) {
                    $rootScope.$emit('addAlert', error);
                }
                else {
                    $scope.CouponHistory = response.data;
                }
            },
            function errorCallback(response) {
                $rootScope.loading = false;
                if (response) {
                    $rootScope.$emit('addAlert', response);
                }
            }
        );
    };

    $scope.changeStatus = function(action) {

        $rootScope.loading = true;

        if (action === 1) {
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
                    if (response) {
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
                    if (response) {
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
                }
            },
            function(response) {
                $rootScope.loading = false;
                if (response) {
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

            var promise = $http.get( apiUrl + '/admin/lookup' + suffix + '?fuzzy=0' )
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
