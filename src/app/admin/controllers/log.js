angular.module('proton.admin')
.controller('LogController', function($controller, $stateParams, users, userFactory) {
    var vm = this;
    angular.extend(vm, $controller('LookupController'));

    var value = $stateParams.query;

    vm.GetUserLogs = () => {
        users.GetUserLogs(vm.UserID)
        .then(({data}) => {
            vm.ResponseLogs = data;
        });
    };

    userFactory.get(value)
    .then(({user}) => {
        vm.UserID = user.ID;
        console.log("blaaaaa");
        vm.GetUserLogs();
    });
});
