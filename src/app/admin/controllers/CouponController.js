angular.module('proton.admin')
.controller(
    'CouponController',
    function($rootScope, payments) {
        var vm = this;

        vm.CouponName = null;
        vm.CouponInputData = null;

        vm.GetCoupons = () => {
            payments.GetCoupons()
                .then(({
                    data
                }) => {
                    vm.Coupons = data.Coupons;
                });
        };

        vm.GetCouponDetails = (name) => {
            vm.CouponName = name;
            payments.GetCouponDetails(name)
                .then(() => {});
        };

        vm.GetCouponHistory = (name) => {
            if (vm.CouponName !== name) {
                vm.CouponWhitelist = null;
            }
            vm.CouponName = name;
            payments.GetCouponHistory(name)
                .then(({
                    data
                }) => {
                    vm.CouponHistory = data.CouponHistory;
                });
        };

        vm.GetCouponWhitelist = (name) => {
            if (vm.CouponName !== name) {
                vm.CouponHistory = null;
            }
            vm.CouponName = name;
            payments.GetCouponWhitelist(name)
                .then(({
                    data
                }) => {
                    vm.CouponWhitelist = data.CouponWhitelist;
                });
        };

        vm.UpdateCouponWhitelist = (name, data) => {
            var body = {
                "UserIDs": [data]
            };
            payments.UpdateCouponWhitelist(name, body)
                .then(() => {
                    $rootScope.$emit('addAlert', 'Added to whitelist.');
                    vm.GetCouponWhitelist(name);
                });
        };

        vm.GetCoupons();
    }
);
