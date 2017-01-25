angular.module('proton.admin')
.controller(
    'ReferrerController',
    function (referrers) {
        var vm = this;

        vm.TimeOptions = [
            { label: "This month", value: 0 },
            { label: "Last month", value: 1 }
            // { label: "Custom"    , value: 2 }
        ];
        vm.CurrentTimeOption = vm.TimeOptions[0];

        vm.GetReferrers = () => {
            referrers.GetReferrers()
                .then(({data}) => {
                    vm.Referrers = data.Referrers;
                });
        };

        vm.GetReferrerDetails = (name) => {

            var date = new Date(), year = date.getFullYear(), month = date.getMonth();

            switch (vm.CurrentTimeOption.value) {
                case 0:
                    break;
                case 1:
                    month = month - 1;
                    break;
            }

            var start_time = new Date(year, month, 1);
            var end_time = new Date(year, month + 1, 1);

            referrers.GetReferrerDetails(name, start_time.getTime(), end_time.getTime())
                .then(({data}) => {
                    vm.Referrer = data;
                });
        };

        vm.GetReferrers();
    }
);
