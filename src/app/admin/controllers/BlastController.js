angular.module('proton.admin')
.controller('BlastController', function() {
    var vm = this;

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
//     $scope.forceMonitorFlag = false;
//     $scope.blastMode = false;
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
