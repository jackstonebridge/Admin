angular.module('proton.admin')
.controller('LookupController', function(lookups, $rootScope, $location, $state, $stateParams, $q) {
    var vm = this;

    vm.LookupString = $stateParams.query;
    vm.MultilookupInput = null;

    vm.FuzzyOptions = [
        { label: "Fuzzy match: OFF"  , value: 0 },
        { label: "Fuzzy match: RIGHT", value: 1 },
        { label: "Fuzzy match: LEFT" , value: 2 },
        { label: "Fuzzy match: ALL"  , value: 3 }
    ];
    vm.CurrentFuzzyOption = vm.FuzzyOptions[0];

    vm.lookup = (value) => {
        value = value || vm.LookupString.trim();
        if (!value || value.length === 0) {
            $rootScope.$emit('addAlert', 'Lookup string is empty.');
            // throw true;
        }
        return value;
    };

    vm.LookupUser = (value = '') => {
        value = vm.lookup(value);
        lookups.LookupUser(value)
        .then(({data}) => {
            vm.Response = data;
            $state.go('private.lookupUser', { query: value });
        });
    };

    vm.LookupOrganization = (value = '') => {
        value = vm.lookup(value);
        lookups.LookupOrganization(value)
        .then(({data}) => {
            vm.Response = data;
            $state.go('private.lookupOrganization', { query: value });
        });
    };

    vm.LookupDomain = (value = '') => {
        value = vm.lookup(value);
        lookups.LookupDomain(value)
        .then(({data}) => {
            vm.Response = data;
            $state.go('private.lookupDomain', { query: value });
        });
    };

    vm.LookupCharge = (value = '') => {
        value = vm.lookup(value);
        lookups.LookupCharge(value)
        .then(({data}) => {
            vm.Response = data;
            $state.go('private.lookupCharge', { query: value });
        });
    };

    // CSV MultiLookup Parsing
    var multilookup = (callback) => {
        var promises = [];
        var parsed = Papa.parse(vm.MultilookupInput);

        for(var i = 0; i < parsed.data.length; i++)
        {
            var query = parsed.data[i][0];
            promises.push(callback(query));
        }

        $q.all(promises)
        .then(({data}) => {
            vm.Response = data;
        });
    };

    vm.MultilookupUser = () => {
        multilookup(lookups.LookupUser);
    };

    var initialize = () => {
        if ($stateParams.query) {
            switch($state.current.name) {
                case 'private.lookupUser':
                    vm.LookupUser($stateParams.query);
                    break;
                case 'private.lookupOrganization':
                    vm.LookupOrganization($stateParams.query);
                    break;
                case 'private.lookupDomain':
                    vm.LookupDomain($stateParams.query);
                    break;
                case 'private.lookupCharge':
                    vm.LookupCharge($stateParams.query);
                    break;
                // default:
                //     vm.LookupUser($stateParams.query);
            }
        }
    };
    initialize();
});

// /**
//  * Master Controller
//  */
// angular
// .module('proton.admin')
// .controller('LookupController', ['$scope', '$http', '$rootScope', '$state', '$q', '$stateParams', '$log', '$location', '$timeout', 'CONFIG', MasterCtrl])
//
// function MasterCtrl($scope, $http, $rootScope, $state, $q, $stateParams, $log, $location, $timeout, Setup)
// {
//     $scope.user = {};
//     $scope.advanced = false;
//     $rootScope.loading = false;
//     $scope.forceMonitorFlag = false;
//     $scope.blastMode = false;
//
//     $scope.template = false;
//
//     $scope.forceMonitor = function() {
//         $scope.forceMonitorFlag = true;
//         $scope.monitor();
//     };
//
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
