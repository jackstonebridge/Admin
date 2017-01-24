angular.module('proton.admin')
.controller(
    'LogController',
    function($controller, $stateParams, users) {
        var vm = this;

        vm.UserID = $stateParams.query;
        vm.Response = null;

        vm.GetUserLogs = () => {
            users.GetUserLogs(vm.UserID)
            .then(({data}) => {
                vm.Response = data;
            });
        };
        vm.GetUserLogs();
    }
);
