angular.module('proton.admin')
.controller('ReferrerController', function(referrers) {
    var vm = this;

    vm.GetReferrers = () => {
        referrers.GetReferrers()
        .then(({data}) => {
            vm.Referrers = data.Referrers;
        });
    };

    vm.GetReferrerDetails = (name) => {
        referrers.GetReferrerDetails(name)
        .then(({data}) => {
            vm.Referrer = data;
        });
    };

    vm.GetReferrers();
});
