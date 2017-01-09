// /**
//  * Master Controller
//  */
// angular
// .module('admin.core')
// .controller('LookupController', ['$scope', '$http', '$rootScope', '$state', '$q', '$stateParams', '$log', '$location', '$timeout', 'CONFIG', MasterCtrl])
// .directive('ngConfirmClick', [
//   function(){
//     return {
//       priority: -1,
//       restrict: 'A',
//       link: function(scope, element, attrs){
//         element.bind('click', function(e){
//           var message = attrs.ngConfirmClick;
//           if(message && !confirm(message)){
//             e.stopImmediatePropagation();
//             e.preventDefault();
//           }
//         });
//       }
//     };
//   }
// ]);
//
// function MasterCtrl($scope, $http, $rootScope, $state, $q, $stateParams, $log, $location, $timeout, Setup)
// {
//     "use strict";
//
//     var apiUrl       = Setup.apiUrl;
//     var appVersion   = Setup.appVersion;
//     var clientId     = Setup.clientId;
//     var clientSecret = Setup.clientSecret;
//
//     // $http.defaults.headers.common['Content-Type'] = 'application/json;charset=utf-8';
//     // $http.defaults.headers.common['x-pm-appversion'] = appVersion;
//     // $http.defaults.headers.common['x-pm-apiversion'] = '1';
//     // $http.defaults.headers.common['Accept'] = 'application/vnd.protonmail.v1+json';
//
//     $scope.user = {};
//     $scope.advanced = false;
//     $rootScope.loading = false;
//     $scope.forceMonitorFlag = false;
//     $scope.blastMode = false;
//
//     $scope.template = false;
//
//     $scope.fuzzyOptions = [
//         { label: "Fuzzy match: OFF"  , value: 0 },
//         { label: "Fuzzy match: RIGHT", value: 1 },
//         { label: "Fuzzy match: LEFT" , value: 2 },
//         { label: "Fuzzy match: ALL"  , value: 3 }
//     ];
//     $scope.currentFuzzyOption = $scope.fuzzyOptions[0];
//
//     $scope.deleteUserOptions = [
//         { label: "Soft delete"  , value: 0 },
//         { label: "Forced delete", value: 1 },
//         { label: "Never existed", value: 2 }
//     ];
//     $scope.currentDeleteUserOption = $scope.deleteUserOptions[0];
//
//     $scope.resetUserSentRateOptions = [
//         { label: "Reset outdated", value: 0 },
//         { label: "Reset ban"     , value: 1 },
//         { label: "Reset all"     , value: 2 }
//     ];
//     $scope.currentResetUserSentRateOption = $scope.resetUserSentRateOptions[1];
//
//     $scope.messageLocationOptions = [
//         { label: "Inbox"  , value: 0 },
//         { label: "Draft"  , value: 1 },
//         { label: "Sent"   , value: 2 },
//         { label: "Trash"  , value: 3 },
//         { label: "Spam"   , value: 4 },
//         { label: "Archive", value: 6 }
//     ];
//     $scope.currentMessageLocationOption = $scope.messageLocationOptions[0];
//
//     var AT = sessionStorage.getItem('AT');
//
//     $rootScope.$on('$stateChangeStart', function(event, toState) {
//
//         if (Setup.debug)
//         {
//             console.debug("(isLoggedIn(), isIndex(), AT) = " + !$scope.isLoggedIn(), (toState.name!=='index'), AT);
//         }
//
//         if (!$scope.isLoggedIn() && toState.name!=='index' && !AT) {
//             event.preventDefault();
//             $state.go('index');
//             return;
//         }
//     });
//
//     /**
//      * Sidebar Toggle & Cookie Control
//      */
//     var mobileView = 992;
//
//     $scope.getWidth = function() {
//         return window.innerWidth;
//     };
//
//     $scope.$watch($scope.getWidth, function(newValue, oldValue) {
//         if (newValue >= mobileView) {
//             if (angular.isDefined(sessionStorage.getItem('toggle'))) {
//                 $scope.toggle = ! sessionStorage.getItem('toggle') ? false : true;
//             } else {
//                 $scope.toggle = true;
//             }
//         } else {
//             $scope.toggle = false;
//         }
//
//     });
//
//     $scope.init = function() {
//         var AT = sessionStorage.getItem('AT');
//         var UID = sessionStorage.getItem('UID');
//         var RF = sessionStorage.getItem('RF');
//         var UN = sessionStorage.getItem('UN');
//         $scope.showLogin = false;
//         if (AT && UID) {
//             if (Setup.debug)
//             {
//                 console.log(sessionStorage);
//             }
//             $http.defaults.headers.common['Authorization'] = 'Bearer '+AT;
//             $http.defaults.headers.common['x-pm-uid'] = UID;
//             if ($state.current.name==='') {
//                 var data = {
//                     "ResponseType": "token",
//                     "ClientID": clientId,
//                     "GrantType": "refresh_token",
//                     "RefreshToken": RF,
//                     "RedirectURI": "http://protonmail.ch",
//                     "State": "random_string"
//                 };
//                 if (Setup.debug)
//                 {
//                     console.log(data);
//                 }
//                 $http.post(apiUrl+'/auth/refresh', data)
//                 .then(
//                     function(response) {
//                         $scope.user = response.data;
//                         $scope.user.Name = UN;
//                         $http.defaults.headers.common['Authorization'] = 'Bearer '+response.data.AccessToken;
//                         $http.defaults.headers.common['x-pm-uid'] = response.data.Uid;
//                         sessionStorage.setItem('AT', response.data.AccessToken);
//                         sessionStorage.setItem('UID', response.data.Uid);
//                         sessionStorage.setItem('RF', response.data.RefreshToken);
//                         if ($state.current.name === 'index') {
//                             $state.go('private.lookup');
//                         }
//                     },
//                     function(response) {
//                         if (response) {
//                             $rootScope.$emit('addAlert', response);
//                         }
//                     }
//                 );
//             }
//         }
//         else {
//             $scope.showLogin = true;
//         }
//         if ($state.params.query!==undefined) {
//             $scope.lookup($state.params.query);
//         }
//
//         // Determine lookup query and template
//         var hash = $location.$$path.replace('/lookup/', '');
//
//         var template = hash.split('=')[0];
//         var query    = hash.split('=')[1];
//
//         if (Setup.debug)
//         {
//             console.debug("Reading hash: "     + hash);
//             console.debug("Reading template: " + template);
//             console.debug("Reading query: "    + query);
//         }
//
//         if ( query    !== undefined && query    !== '' && query    !== '/' &&
//              template !== undefined && template !== '' && template !== '/' )
//         {
//             $timeout(
//                 function()
//                 {
//                     $scope.lookupString = query;
//                     $scope.lookup(template, query);
//                 },
//                 1000
//             );
//         }
//     };
//
//     $scope.toggleSidebar = function() {
//         $scope.toggle = !$scope.toggle;
//         sessionStorage.setItem('toggle', $scope.toggle);
//     };
//
//     window.onresize = function() {
//         $scope.$apply();
//     };
//
//     $scope.isLoggedIn = function() {
//         return ($scope.user.UserStatus !== undefined);
//     };
//
//     $scope.login = function() {
//
//         var username = this.username;
//
//         var data = {
//             "ResponseType": "token",
//             "Username": this.username, // this referecnes the form object thats sent for ng-submit
//             "Password": this.password,
//             "ClientID": clientId,
//             "ClientSecret": clientSecret,
//             "GrantType": "password",
//             "RedirectURI": "http://protonmail.ch",
//             "State": "random_string"
//         };
//         $rootScope.$emit('closeAlert', 0);
//
//         $rootScope.loading = true;
//         $http.post(apiUrl+'/auth', data)
//         .then(
//             function(response) {
//                 $rootScope.loading = false;
//                 var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
//                 if (error) {
//                     $rootScope.$emit('addAlert', error);
//                 }
//                 else {
//                     $scope.user = response.data;
//                     $scope.user.Name = username;
//                     $http.defaults.headers.common['Authorization'] = 'Bearer '+response.data.AccessToken;
//                     $http.defaults.headers.common['x-pm-uid'] = response.data.Uid;
//                     sessionStorage.setItem('AT', response.data.AccessToken);
//                     sessionStorage.setItem('UID', response.data.Uid);
//                     sessionStorage.setItem('RF', response.data.RefreshToken);
//                     sessionStorage.setItem('UN', username);
//                     $state.go('private.lookup');
//                 }
//             },
//             function(response) {
//                 $rootScope.loading = false;
//                 if (response) {
//                     $rootScope.$emit('addAlert', response);
//                 }
//                 // called asynchronously if an error occurs
//             }
//         );
//     };
//
//     $scope.logout = function() {
//
//         $rootScope.loading = true;
//
//         $http.delete(apiUrl+'/auth')
//         .then(
//             function(response) {
//                 $rootScope.loading = false;
//                 var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
//                 if (error) {
//                     $rootScope.$emit('addAlert', error);
//                 }
//             },
//             function(response) {
//                 $rootScope.loading = false;
//                 if (response) {
//                     $rootScope.$emit('addAlert', response);
//                 }
//                 // called asynchronously if an error occurs
//             }
//         );
//         $scope.user = {};
//         $http.defaults.headers.common['Authorization'] = undefined;
//         $http.defaults.headers.common['x-pm-uid'] = undefined;
//         sessionStorage.clear();
//         $scope.showLogin = true;
//         $state.go('index');
//         window.location.reload();
//
//     };
//
//     $scope.adminList = function() {
//         $rootScope.loading = true;
//         $http.get(apiUrl+'/admin/admins')
//         .then(
//             function(response) {
//                 $rootScope.loading = false;
//                 var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
//                 if (error) {
//                     $rootScope.$emit('addAlert', error);
//                 }
//                 else {
//                     $scope.Admins = response.data.Admins;
//                     $scope.Supers = response.data.Supers;
//                 }
//             },
//             function(response) {
//                 $rootScope.loading = false;
//                 if (response) {
//                     $rootScope.$emit('addAlert', response);
//                 }
//                 // called asynchronously if an error occurs
//             }
//         );
//     };
//
//     $scope.initInfo = function() {
//         $scope.lookupResponse = [];
//     };
//
//     $scope.setLookupTemplate = function(template)
//     {
//         if (template === "user"         ||
//             template === "domain"       ||
//             template === "organization" ||
//             template === "charge")
//         {
//             $scope.template = "templates/lookup/" + template + ".html";
//         }
//     };
//
//     $scope.lookup = function(template, query)
//     {
//         var lookupString, lookupTemplate;
//
//         if (template === undefined) { return; }
//         else
//         {
//             lookupTemplate = template;
//             this.setLookupTemplate(template);
//         }
//
//         if (query === undefined) {
//             if (this.lookupString === undefined) { return; }
//             lookupString = this.lookupString.trim();
//             // Set the scope lookupString to the current search
//         } else {
//             lookupString = query;
//         }
//
//         $scope.lookupString = lookupString;
//
//         if (Setup.debug)
//         {
//             console.debug("MasterCtrl.lookup: lookupTemplate      = " + lookupTemplate);
//             console.debug("MasterCtrl.lookup: lookupString        = " + lookupString);
//             console.debug("MasterCtrl.lookup: this.lookupString   = " + this.lookupString);
//             console.debug("MasterCtrl.lookup: $scope.lookupString = " + $scope.lookupString);
//             console.debug("MasterCtrl.lookup: $scope.currentFuzzyOption.value = " + this.currentFuzzyOption.value);
//         }
//
//         // window.location.hash = '#/lookup/' + lookupTemplate + '=' + lookupString + '?fuzzy=' + this.currentFuzzyOption.value;
//
//         $rootScope.loading = true;
//         $scope.lookupResponse = [];
//
//         // Call backend route
//         $http.get( apiUrl + '/admin/lookup/' + encodeURIComponent(lookupTemplate) + '/' + encodeURIComponent(lookupString) + '?fuzzy=' + this.currentFuzzyOption.value )
//         .then(
//             function(response)
//             {
//                 $rootScope.loading = false;
//                 var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
//                 if (error) {
//                     $rootScope.$emit('addAlert', error);
//                 }
//                 else {
//                     // if empty we say "No info found."
//                     if (
//                         response.data.Results &&
//                         response.data.Results.length === 0
//                     ) {
//                         $rootScope.$emit('addAlert', 'No information found');
//                     }
//                     $scope.lookupResponse.push(response.data);
//                 }
//             },
//             function(response)
//             {
//                 $rootScope.loading = false;
//                 $rootScope.$emit('addAlert', response);
//                 // called asynchronously if an error occurs
//             }
//         );
//     };
//
//     $scope.randPass = function() {
//         return Math.random().toString(36).slice(-8)+''+Math.random().toString(36).slice(-8);
//     };
//
//     $scope.changeNotificationEmail = function() {
//
//         var data =  {
//             "NotificationEmail": this.accountNotfEmail
//         };
//
//         $rootScope.loading = true;
//
//         $http.put(apiUrl+'/admin/user/'+this.accountID+'/noticeemail', data)
//         .then(
//             function(response) {
//                 $rootScope.loading = false;
//                 var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
//                 if (error) {
//                     $rootScope.$emit('addAlert', error);
//                 }
//                 else {
//                     $rootScope.$emit('addAlert', 'Notification email updated.');
//                 }
//             },
//             function(response) {
//                 $rootScope.loading = false;
//                 if (response) {
//                     $rootScope.$emit('addAlert', response);
//                 }
//                 // called asynchronously if an error occurs
//             }
//         );
//     };
//
//     $scope.changeInviteEmail = function() {
//
//         var data =  {
//             "Email": this.Email
//         };
//
//         $rootScope.loading = true;
//
//         $http.put(apiUrl+'/admin/invite/'+this.accountID+'/email', data)
//         .then(
//             function(response) {
//                 $rootScope.loading = false;
//                 var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
//                 if (error) {
//                     $rootScope.$emit('addAlert', error);
//                 }
//                 else {
//                     $rootScope.$emit('addAlert', 'Invite Email Updated.');
//                 }
//             },
//             function(response) {
//                 $rootScope.loading = false;
//                 if (response) {
//                     $rootScope.$emit('addAlert', response);
//                 }
//                 // called asynchronously if an error occurs
//             }
//         );
//     };
//
//     $scope.createInvite = function() {
//
//         $rootScope.loading = true;
//
//         var data = {
//             "Username": this.CreateInviteUsername,
//             "Email"   : this.CreateInviteEmail
//         };
//
//         $http.post(apiUrl + '/admin/invite', data)
//         .then(
//             function(response) {
//                 $rootScope.loading = false;
//                 var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
//                 if (error) {
//                     $rootScope.$emit('addAlert', error);
//                 }
//                 else {
//                     $rootScope.$emit('addAlert', 'Invite created for ' + data.Username + ' (' + data.Email + ')');
//                     $scope.lookupString = data.Email;
//                     // window.location.hash = "#/lookup/user=" + data.Email;
//                     $scope.lookup('user');
//                 }
//             },
//             function(response) {
//                 $rootScope.loading = false;
//                 if (response) {
//                     $rootScope.$emit('addAlert', response);
//                 }
//             }
//         );
//     };
//
//     $scope.sendInvite = function() {
//
//         $rootScope.loading = true;
//
//         $http.post(apiUrl + '/admin/invite/' + this.accountID + '/send')
//         .then(
//             function(response) {
//                 $rootScope.loading = false;
//                 var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
//                 if (error) {
//                     $rootScope.$emit('addAlert', error);
//                 }
//                 else {
//                     $rootScope.$emit('addAlert', 'Invite Sent for '+$scope.lookupString);
//                     $scope.lookupResponse = [];
//                     $scope.lookupString = '';
//                 }
//             },
//             function(response) {
//                 $rootScope.loading = false;
//                 if (response) {
//                     $rootScope.$emit('addAlert', response);
//                 }
//             }
//         );
//     };
//
//     $scope.getTotalUnread = function() {
//         var total = 0;
//         angular.forEach($scope.monitorAccounts.data.Accounts, function(value, key) {
//             total += value.Total;
//         });
//         return total;
//     };
//
//     $scope.forceMonitor = function() {
//         $scope.forceMonitorFlag = true;
//         $scope.monitor();
//     };
//
//     $scope.monitor = function() {
//
//         if ($scope.monitorAccounts && !$scope.forceMonitorFlag) { return; }
//
//         // $http.get('/monitor.json')
//         $rootScope.loading = true;
//         $scope.monitorAccounts = '';
//         $scope.TotalUnread = '';
//         $http.get(apiUrl+'/admin/monitor')
//         .then(
//             function(response) {
//                 $rootScope.loading = false;
//                 var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
//                 if (error) {
//                     $rootScope.$emit('addAlert', error);
//                 }
//                 else {
//                     $scope.monitorAccounts = response;
//                     $scope.TotalUnread = $scope.getTotalUnread();
//                 }
//                 $scope.forceMonitorFlag = false;
//             },
//             function(response) {
//                 $rootScope.loading = false;
//                 if (response) {
//                     $rootScope.$emit('addAlert', response);
//                 }
//                 $scope.forceMonitorFlag = false;
//                 // called asynchronously if an error occurs
//             }
//         );
//     };
//
//     $scope.flaggedPotentialSpammer = function(SentRate) {
//         var seconds_left = SentRate.BanTime - Math.floor(Date.now() / 1000) + 604800;
//         if (seconds_left > 0) {
//             return 1;
//         }
//         if (SentRate.HourlyRecipients >= (SentRate.Reputation - 2)) {
//             return 1;
//         }
//         if (SentRate.Blackhole > 0) {
//             return 1;
//         }
//         return 0;
//     };
//
//     $scope.CheckSpam = function() {
//         window.open("#/messages?UserID=" + this.accountID, "_self");
//     };
//
//     $scope.forceMessages = function() {
//         $scope.forceMessagesFlag = true;
//         $scope.getUserMessages();
//     };
//
//     $scope.GetUserMessages = function()
//     {
//         $rootScope.loading = true;
//         $scope.messagesResponse = '';
//
//         var UserID = $location.absUrl().split('?UserID=')[1];
//
//         if (Setup.debug)
//         {
//             console.debug(UserID);
//             console.debug(this.currentMessageLocationOption.value);
//         }
//
//         $http.get(apiUrl + '/admin/user/' + UserID + '/messages?Location=' + this.currentMessageLocationOption.value + '&Page=' + this.Page + '&PageSize=' + this.PageSize + '&Unread=' + this.Unread)
//         .then(
//             function(response) {
//                 $rootScope.loading = false;
//                 var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
//                 if (error) {
//                     $rootScope.$emit('addAlert', error);
//                 } else {
//                     $scope.messagesResponse = response;
//                     if (!response.data.IsPotentialSpammer)
//                     {
//                         $rootScope.$emit('addAlert', 'User is not flagged as a potential spammer');
//                     }
//                     if ($scope.user.Scope === 'admin super')
//                     {
//                         $rootScope.$emit('addAlert', 'Displaying last 5 messages for super admins');
//                     }
//                 }
//                 $scope.forceMessagesFlag = false;
//             },
//             function(response) {
//                 $rootScope.loading = false;
//                 if (response) {
//                     $rootScope.$emit('addAlert', response);
//                 }
//                 $scope.forceMessagesFlag = false;
//             }
//         );
//     };
//
//     $scope.AddMobileBeta = function()
//     {
//         var data =  {
//             "UserIDs": [this.accountID]
//         };
//
//         $rootScope.loading = true;
//
//         $http.post(apiUrl + '/admin/user/mobile', data)
//         .then(
//             function successCallback(response) {
//                 $rootScope.loading = false;
//                 var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
//                 if (error) {
//                     $rootScope.$emit('addAlert', error);
//                 }
//             },
//             function errorCallback(response) {
//                 $rootScope.loading = false;
//                 if (response) {
//                     $rootScope.$emit('addAlert', response);
//                 }
//             }
//         );
//     };
//
//     $scope.ResetUserSentRate = function()
//     {
//         var data =  {
//             "Force": this.currentResetUserSentRateOption.value
//         };
//
//         $rootScope.loading = true;
//
//         $http.put(apiUrl + '/admin/user/' + this.accountID + '/sentrate', data)
//         .then(
//             function successCallback(response) {
//                 $rootScope.loading = false;
//                 var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
//                 if (error) {
//                     $rootScope.$emit('addAlert', error);
//                 } else {
//                     window.location.reload();
//                 }
//             },
//             function errorCallback(response) {
//                 $rootScope.loading = false;
//                 if (response) {
//                     $rootScope.$emit('addAlert', response);
//                 }
//             }
//         );
//     };
//
//     $scope.ResetUserReputation = function()
//     {
//         $rootScope.loading = true;
//
//         $http.put(apiUrl + '/admin/user/' + this.accountID + '/reputation')
//         .then(
//             function successCallback(response)
//             {
//                 $rootScope.loading = false;
//                 var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
//                 if (error) {
//                     $rootScope.$emit('addAlert', error);
//                 } else {
//                     window.location.reload();
//                 }
//             },
//             function errorCallback(response) {
//                 $rootScope.loading = false;
//                 if (response) {
//                     $rootScope.$emit('addAlert', response);
//                 }
//             }
//         );
//     };
//
//     $scope.ResetLoginPassword = function()
//     {
//         $rootScope.loading = true;
//
//         $http.put(apiUrl + '/admin/user/' + this.accountID + '/password')
//         .then(
//             function successCallback(response)
//             {
//                 $rootScope.loading = false;
//                 var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
//                 if (error) {
//                     $rootScope.$emit('addAlert', error);
//                 } else {
//                     $rootScope.$emit('addAlert', 'Reset code sent.');
//                 }
//             },
//             function errorCallback(response)
//             {
//                 $rootScope.loading = false;
//                 if (response) {
//                     $rootScope.$emit('addAlert', response);
//                 }
//             }
//         );
//     };
//
//     $scope.ViewUserPayments = function() {
//         // window.location.hash = '#/payments';
//         this.GetUserPayments();
//     };
//
//     $scope.GetUserPayments = function()
//     {
//         $rootScope.loading = true;
//         $scope.UserID = this.UserID;
//
//         $http.get(apiUrl + '/admin/user/' + $scope.UserID + '/payments')
//         .then(
//             function successCallback(response)
//             {
//                 $rootScope.loading = false;
//                 var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
//                 if (error) {
//                     $rootScope.$emit('addAlert', error);
//                 } else {
//                     $scope.ResponsePayments = response;
//                 }
//             },
//             function errorCallback(response)
//             {
//                 $rootScope.loading = false;
//                 if (response) {
//                     $rootScope.$emit('addAlert', response);
//                 }
//             }
//         );
//     };
//
//     $scope.ViewUserLogs = function() {
//         // window.location.hash = '#/logs';
//         this.GetUserLogs();
//     };
//
//     $scope.GetUserLogs = function()
//     {
//         $rootScope.loading = true;
//         $scope.UserID = this.UserID;
//
//         $http.get(apiUrl + '/admin/user/' + $scope.UserID + '/logs')
//         .then(
//             function successCallback(response)
//             {
//                 $rootScope.loading = false;
//                 var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
//                 if (error) {
//                     $rootScope.$emit('addAlert', error);
//                 } else {
//                     $scope.ResponseLogs = response;
//                 }
//             },
//             function errorCallback(response)
//             {
//                 $rootScope.loading = false;
//                 if (response) {
//                     $rootScope.$emit('addAlert', response);
//                 }
//             }
//         );
//     };
//
//     $scope.GetInvoice = function(InvoiceID)
//     {
//         $rootScope.loading = true;
//
//         $http.get(apiUrl + '/admin/invoice/' + InvoiceID, {responseType:'arraybuffer'})
//         .then(
//             function successCallback(response)
//             {
//                 $rootScope.loading = false;
//                 var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
//                 if (error) {
//                     $rootScope.$emit('addAlert', error);
//                 } else {
//                     var file = new Blob([response.data], {type: "application/pdf"});
//                     var fileURL = URL.createObjectURL(file);
//                     var a         = document.createElement('a');
//                     a.href        = fileURL;
//                     a.target      = '_blank';
//                     a.download    = 'Invoice_' + InvoiceID + '.pdf';
//                     document.body.appendChild(a);
//                     a.click();
//                 }
//             },
//             function errorCallback(response)
//             {
//                 $rootScope.loading = false;
//                 if (response) {
//                     $rootScope.$emit('addAlert', response);
//                 }
//             }
//         );
//     };
//
//     $scope.logoutUser = function() {
//
//         $rootScope.loading = true;
//
//         $http.put(apiUrl+'/admin/user/'+this.accountID+'/logout')
//         .then(
//             function(response) {
//                 $rootScope.loading = false;
//                 var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
//                 if (error) {
//                     $rootScope.$emit('addAlert', error);
//                 }
//                 else {
//                     $rootScope.$emit('addAlert', 'User Logged Out.');
//                 }
//             },
//             function(response) {
//                 $rootScope.loading = false;
//                 if (response) {
//                     $rootScope.$emit('addAlert', response);
//                 }
//                 // called asynchronously if an error occurs
//             }
//         );
//     };
//
//     $scope.DisableTwoFactor = function()
//     {
//         $rootScope.loading = true;
//
//         $http.delete(apiUrl + '/admin/user/' + this.accountID + '/2fa')
//         .then(
//             function successCallback(response) {
//                 $rootScope.loading = false;
//                 var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
//                 if (error) {
//                     $rootScope.$emit('addAlert', error);
//                 } else {
//                     window.location.reload();
//                     $rootScope.$emit('addAlert', 'Two Factor Authentication Disabled.');
//                 }
//             },
//             function errorCallback(response) {
//                 $rootScope.loading = false;
//                 if (response) {
//                     $rootScope.$emit('addAlert', response);
//                 }
//             }
//         );
//     };
//
//     $scope.ResetUserLogs = function()
//     {
//         $rootScope.loading = true;
//
//         $http.put(apiUrl + '/admin/user/' + this.accountID + '/logs')
//         .then(
//             function successCallback(response) {
//                 $rootScope.loading = false;
//                 var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
//                 if (error) {
//                     $rootScope.$emit('addAlert', error);
//                 } else {
//                     window.location.reload();
//                     $rootScope.$emit('addAlert', 'Authentication logging reset to basic.');
//                 }
//             },
//             function errorCallback(response) {
//                 $rootScope.loading = false;
//                 if (response) {
//                     $rootScope.$emit('addAlert', response);
//                 }
//             }
//         );
//     };
//
//     $scope.deleteUserAU = function()
//     {
//         $rootScope.loading = true;
//         var delete_url = apiUrl + '/admin/user/' + this.accountID + '?Force=' + this.currentDeleteUserOption.value;
//
//         $http.delete(delete_url)
//         .then(
//             function(response) {
//                 $rootScope.loading = false;
//                 var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
//                 if (error) {
//                     $rootScope.$emit('addAlert', error);
//                 }
//                 else {
//                     $rootScope.$emit('addAlert', 'Deleted from Active Users.');
//                     window.location.reload();
//                 }
//             },
//             function(response) {
//                 $rootScope.loading = false;
//                 if (response) {
//                     $rootScope.$emit('addAlert', response);
//                 }
//                 // called asynchronously if an error occurs
//             }
//         );
//     };
//
//     $scope.blast = function() {
//
//         var papaBlastList = Papa.parse(this.blastList);
//         var List = [];
//
//         for(var i = 0; i < papaBlastList.data.length; i++) {
//             var email = papaBlastList.data[i][0];
//             List.push(email);
//         }
//
//         var data =  {
//             "Subject"   : this.blastSubject,
//             "Body"      : this.blastMessage,
//             "Except"    : this.blastMode,
//             "Usernames" : List,
//         };
//
//         $scope.blastData = data;
//
//         $rootScope.loading = true;
//
//         $http.post(apiUrl+'/admin/blast', data)
//         .then(
//             function(response) {
//                 $rootScope.loading = false;
//                 var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
//                 if (error) {
//                     $rootScope.$emit('addAlert', error);
//                 }
//                 else {
//                     if (response.data.Responses.length === 0) {
//                         $rootScope.$emit('addAlert', 'Message Blast Sent. No errors!');
//                     }
//                     else {
//                         var message = '';
//                         response.data.Responses.forEach( function(rsp) {
//                             message += '<p>'+rsp.Error+': <code>'+rsp.ErrorDescription+'</code></p>';
//                         });
//                         $rootScope.$emit('addAlert', message);
//                     }
//
//                 }
//             },
//             function(response) {
//                 $rootScope.loading = false;
//                 if (response) {
//                     $rootScope.$emit('addAlert', response);
//                 }
//             }
//         );
//     };
//
//     $scope.deleteUserWL = function() {
//
//         $rootScope.loading = true;
//
//         $http.delete(apiUrl+'/admin/invite/' + this.accountID)
//         .then(
//             function(response) {
//                 $rootScope.loading = false;
//                 var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
//                 if (error) {
//                     $rootScope.$emit('addAlert', error);
//                 }
//                 else {
//                     $rootScope.$emit('addAlert', 'Deleted from Waiting List.');
//                     $scope.lookupResponse.Results = 'undefined';
//                     window.location.reload();
//                 }
//             },
//             function(response) {
//                 $rootScope.loading = false;
//                 if (response) {
//                     $rootScope.$emit('addAlert', response);
//                 }
//             }
//         );
//     };
//
//     $scope.deleteOrganization = function()
//     {
//         $rootScope.loading = true;
//
//         $http.delete(apiUrl+'/admin/organization/' + this.accountID)
//         .then(
//             function(response) {
//                 $rootScope.loading = false;
//                 var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
//                 if (error) {
//                     $rootScope.$emit('addAlert', error);
//                 }
//                 else {
//                     $rootScope.$emit('addAlert', 'Organization deleted.');
//                     $scope.lookupResponse.Results = 'undefined';
//                     window.location.reload();
//                 }
//             },
//             function(response) {
//                 $rootScope.loading = false;
//                 if (response) {
//                     $rootScope.$emit('addAlert', response);
//                 }
//             }
//         );
//     };
//
//     $scope.deletePaymentsCustomer = function()
//     {
//         $rootScope.loading = true;
//
//         $http.delete(apiUrl + '/admin/payments/customer/' + this.accountID)
//         .then(
//             function(response) {
//                 $rootScope.loading = false;
//                 var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
//                 if (error) {
//                     $rootScope.$emit('addAlert', error);
//                 }
//                 else {
//                     $rootScope.$emit('addAlert', 'Payment method deleted.');
//                     $scope.lookupResponse.Results = 'undefined';
//                     window.location.reload();
//                 }
//             },
//             function errorCallback(response) {
//                 $rootScope.loading = false;
//                 if (response) {
//                     $rootScope.$emit('addAlert', response);
//                 }
//             }
//         );
//     };
//
//     $scope.deletePaymentsMethod = function(PaymentMethodID)
//     {
//         $rootScope.loading = true;
//
//         $http.delete(apiUrl + '/admin/payments/method/' + this.accountID + '?PaymentMethodID=' +  PaymentMethodID)
//         .then(
//             function(response) {
//                 $rootScope.loading = false;
//                 var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
//                 if (error) {
//                     $rootScope.$emit('addAlert', error);
//                 }
//                 else {
//                     $rootScope.$emit('addAlert', 'Customer deleted.');
//                     $scope.lookupResponse.Results = 'undefined';
//                     window.location.reload();
//                 }
//             },
//             function errorCallback(response) {
//                 $rootScope.loading = false;
//                 if (response) {
//                     $rootScope.$emit('addAlert', response);
//                 }
//             }
//         );
//     };
//
//     $scope.creditUser = function(UserID, Credit)
//     {
//         $rootScope.loading = true;
//
//         var data = {
//             "Credit": Credit * 100,
//             "Description": "Admin panel credit adjustment"
//         };
//
//         $http.put(apiUrl + '/admin/user/' + UserID + '/credit', data)
//         .then(
//             function successCallback(response) {
//                 $rootScope.loading = false;
//                 var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
//                 if (error) {
//                     $rootScope.$emit('addAlert', error);
//                 } else {
//                     $rootScope.$emit('addAlert', 'Changed credit ' + Credit + ' of user ' + UserID + '.');
//                     $scope.lookupResponse.Results = 'undefined';
//                     window.location.reload();
//                 }
//             },
//             function errorCallback(response) {
//                 $rootScope.loading = false;
//                 if (response) {
//                     $rootScope.$emit('addAlert', response);
//                 }
//             }
//         );
//     };
//
//     $scope.listCoupons = function(CouponCode)
//     {
//         $rootScope.loading = true;
//         var param = (CouponCode === undefined) ? '' : '/' + CouponCode;
//         $http.get(apiUrl + '/admin/coupons' + param)
//         .then(
//             function successCallback(response) {
//                 $rootScope.loading = false;
//                 var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
//                 if (error) {
//                     $rootScope.$emit('addAlert', error);
//                 } else {
//                     $scope.Coupons = response.data.Coupons;
//                 }
//             },
//             function errorCallback(response) {
//                 $rootScope.loading = false;
//                 if (response) {
//                     $rootScope.$emit('addAlert', response);
//                 }
//             }
//         );
//     };
//
//     $scope.listSubscriptions = function(CreateTime)
//     {
//         $rootScope.loading = true;
//         var param = (CreateTime === undefined) ? new Date().getTime() : CreateTime;
//         $http.get(apiUrl + '/admin/payments/' + param)
//         .then(
//             function successCallback(response) {
//                 $rootScope.loading = false;
//                 var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
//                 if (error) {
//                     $rootScope.$emit('addAlert', error);
//                 } else {
//                     $scope.Subscriptions = response.data;
//                 }
//             },
//             function errorCallback(response) {
//                 $rootScope.loading = false;
//                 if (response) {
//                     $rootScope.$emit('addAlert', response);
//                 }
//             }
//         );
//     };
//
//     $scope.listCoupon = function(couponName)
//     {
//         $rootScope.loading = true;
//         $scope.CouponName = couponName;
//         $rootScope.loading = false;
//     };
//
//     $scope.listCouponWhitelist = function(couponName)
//     {
//         $rootScope.loading = true;
//         if ($scope.CouponName !== couponName) {
//             $scope.CouponHistory = undefined;
//         }
//         $scope.CouponName = couponName;
//         $http.get(apiUrl + '/admin/coupons/' + $scope.CouponName + '/whitelist')
//         .then(
//             function successCallback(response) {
//                 $rootScope.loading = false;
//                 var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
//                 if (error) {
//                     $rootScope.$emit('addAlert', error);
//                 } else {
//                     $scope.CouponWhitelist = response.data;
//                 }
//             },
//             function errorCallback(response) {
//                 $rootScope.loading = false;
//                 if (response) {
//                     $rootScope.$emit('addAlert', response);
//                 }
//             }
//         );
//     };
//
//     $scope.addUserCouponWhitelist = function(couponName, couponInputData)
//     {
//         $rootScope.loading = true;
//
//         var parsedInputData = Papa.parse(couponInputData);
//         var userIDs = [];
//
//         for(var i = 0; i < parsedInputData.data.length; i++)
//         {
//             userIDs.push(parsedInputData.data[i][0]);
//         }
//
//         var data = {
//             "UserIDs": userIDs
//         };
//
//         $http.put(apiUrl + '/admin/coupons/' + couponName + '/whitelist', data)
//         .then(
//             function(response) {
//                 $rootScope.loading = false;
//                 var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
//                 if (error) {
//                     $rootScope.$emit('addAlert', error);
//                 }
//                 else {
//                     $rootScope.$emit('addAlert', 'Added to whitelist.');
//                     $scope.listCouponWhitelist(couponName);
//                 }
//             },
//             function(response) {
//                 $rootScope.loading = false;
//                 if (response) {
//                     $rootScope.$emit('addAlert', response);
//                 }
//             }
//         );
//     };
//
//     $scope.listCouponHistory = function(couponName)
//     {
//         $rootScope.loading = true;
//         if ($scope.CouponName !== couponName) {
//             $scope.CouponWhitelist = undefined;
//         }
//         $scope.CouponName = couponName;
//         $http.get(apiUrl + '/admin/coupons/' + $scope.CouponName + '/history')
//         .then(
//             function successCallback(response) {
//                 $rootScope.loading = false;
//                 var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
//                 if (error) {
//                     $rootScope.$emit('addAlert', error);
//                 } else {
//                     $scope.CouponHistory = response.data;
//                 }
//             },
//             function errorCallback(response) {
//                 $rootScope.loading = false;
//                 if (response) {
//                     $rootScope.$emit('addAlert', response);
//                 }
//             }
//         );
//     };
//
//     $scope.changeStatus = function(action) {
//
//         $rootScope.loading = true;
//
//         if (action === 1) {
//             $http.put(apiUrl+'/admin/user/'+this.accountID+'/disable')
//             .then(
//                 function successCallback(response) {
//                     $rootScope.loading = false;
//                     var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
//                     if (error) {
//                         $rootScope.$emit('addAlert', error);
//                     }
//                     else {
//                         $rootScope.$emit('addAlert', 'User Disabled.');
//                         window.location.reload();
//                     }
//                 },
//                 function errorCallback(response) {
//                     $rootScope.loading = false;
//                     if (response) {
//                         $rootScope.$emit('addAlert', response);
//                     }
//                 }
//             );
//         }
//         else if (action === 2) {
//             $http.put(apiUrl+'/admin/user/'+this.accountID+'/enable')
//             .then(
//                 function(response) {
//                     $rootScope.loading = false;
//                     var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
//                     if (error) {
//                         $rootScope.$emit('addAlert', error);
//                     }
//                     else {
//                         $rootScope.$emit('addAlert', 'User Enabled.');
//                         window.location.reload();
//                     }
//                 },
//                 function(response) {
//                     $rootScope.loading = false;
//                     if (response) {
//                         $rootScope.$emit('addAlert', response);
//                     }
//                 }
//             );
//         }
//         else if (action === 3) {
//             $http.put(apiUrl+'/admin/user/'+this.accountID+'/admin')
//             .then(
//                 function(response) {
//                     $rootScope.loading = false;
//                     var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
//                     if (error) {
//                         $rootScope.$emit('addAlert', error);
//                     }
//                     else {
//                         $rootScope.$emit('addAlert', 'User is now ADMIN.');
//                         window.location.reload();
//                     }
//                 },
//                 function(response) {
//                     $rootScope.loading = false;
//                     if (response) {
//                         $rootScope.$emit('addAlert', response);
//                     }
//                 }
//             );
//         }
//
//     };
//
//     $scope.ChangeLevel = function(level) {
//         $rootScope.loading = true;
//
//         var data = {
//             "Level": level
//         };
//
//         $http.put(apiUrl+'/admin/user/' + this.accountID + '/level', data)
//         .then(
//             function successCallback(response) {
//                 $rootScope.loading = false;
//                 var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
//                 if (error) {
//                     $rootScope.$emit('addAlert', error);
//                 } else {
//                     window.location.reload();
//                     $rootScope.$emit('addAlert', 'Level changed.');
//                 }
//             },
//             function errorCallback(response) {
//                 $rootScope.loading = false;
//                 if (response) {
//                     $rootScope.$emit('addAlert', response);
//                 }
//             }
//         );
//     };
//
//     // CSV MultiLookup Parsing
//     $scope.multilookup = function(template)
//     {
//         var promises = [];
//         this.setLookupTemplate(template);
//         $scope.debugJSON = Papa.parse(this.csvData);
//         $rootScope.loading = true;
//
//         for(var i = 0; i < $scope.debugJSON.data.length; i++)
//         {
//             var query = $scope.debugJSON.data[i][0];
//
//             var suffix = '';
//             suffix += '/' + encodeURIComponent(template);
//             suffix += '/' + encodeURIComponent(query);
//
//             var promise = $http.get( apiUrl + '/admin/lookup' + suffix + '?fuzzy=0' )
//             .then(
//                 function(response) {
//                     return response.data;
//                 }
//             );
//             promises.push(promise);
//         }
//
//         $q.all(promises)
//         .then(
//             function(response) {
//                 $scope.lookupResponse = response;
//                 $rootScope.loading = false;
//             }
//         );
//     };
//
//     $scope.init();
// }
