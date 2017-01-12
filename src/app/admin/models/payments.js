angular.module('proton.admin')
.factory('payments', ($http, $q, url) => {
    return {
        GetCoupons() {
            return $http.get(url.get() + '/admin/payments/coupons');
        },
        GetCouponDetails(name) {
            return $http.get(url.get() + '/admin/payments/coupons/' + name);
        },
        GetCouponHistory(name) {
            return $http.get(url.get() + '/admin/payments/coupons/' + name + '/history');
        },
        GetCouponWhitelist(name) {
            return $http.get(url.get() + '/admin/payments/coupons/' + name + '/whitelist');
        },
        GetSubscriptions(time) {
            return $http.get(url.get() + '/admin/payments/subscriptions/' + time);
        },
        UpdateCouponWhitelist(name, data) {
            return $http.put(url.get() + '/admin/payments/coupons/' + name + '/whitelist', data);
        }
    };
});
