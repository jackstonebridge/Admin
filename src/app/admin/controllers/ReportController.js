angular.module('proton.admin')
.controller(
    'ReportController',
    function(payments) {
        var vm = this;

        vm.GetSubscriptions = (CreateTime) => {
            var time = (CreateTime === undefined) ? new Date().getTime() : CreateTime;
            payments.GetSubscriptions(time)
            .then(({data}) => {
                vm.Subscriptions = data;
            });
        };
    }
);
