/**
 * Alerts Controller
 */

angular
    .module('RDash')
    .controller('AlertsCtrl', ['$scope', '$rootScope', AlertsCtrl]);

function AlertsCtrl($scope, $rootScope) {
    $scope.alerts = [];

    $scope.addAlert = function(message) {
        $scope.alerts = [{
            msg: message
        }];
    };

    $rootScope.$on('addAlert', function(event, data) {
        $scope.addAlert(data);
    });

    $rootScope.$on('closeAlert', function(event, data) {
        $scope.closeAlert(data);
    });

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };
}