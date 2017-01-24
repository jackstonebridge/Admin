angular.module('proton.admin')
.controller(
    'MonitorController',
    function(monitors) {
        var vm = this;

        vm.Accounts = null;
        vm.TotalUnread = null;

        vm.Monitor = () => {
            monitors.Monitor()
            .then(({data}) => {
                vm.Accounts = data.Accounts;
            });
        };

        vm.getTotalUnread = function() {
            var total = 0;
            angular.forEach(vm.Accounts, function(value) {
                total += value.Total;
            });
            return total;
        };
        vm.TotalUnread = vm.getTotalUnread();
    }
);
