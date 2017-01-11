angular.module('proton.admin')
.controller('ReportController', function(payments) {
    var vm = this;

    vm.GetPayments = (CreateTime) => {
        var time = (CreateTime === undefined) ? new Date().getTime() : CreateTime;
        payments.get(time)
        .then(({data}) => {
            vm.Subscriptions = data;
        });
    };
});
