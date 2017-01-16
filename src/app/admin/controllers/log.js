angular.module('proton.admin')
.controller('LogController', function(users) {
    var vm = this;
    console.log("LogController");
    vm.GetUserLogs = () => {
        users.GetUserLogs()
        .then(({data}) => {
            vm.ResponseLogs = data;
        });
    };
    vm.GetUserLogs();
});
