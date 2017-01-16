angular.module('proton.admin')
.controller('LogController', function($controller, $stateParams, users) {
    var vm = this;
    angular.extend(vm, $controller('LookupController'));

    vm.UserID = $stateParams.query;

    vm.GetUserLogs = () => {
        users.GetUserLogs(vm.UserID)
        .then(({data}) => {
            vm.Response = data;
        });
    };
    vm.GetUserLogs();
});
