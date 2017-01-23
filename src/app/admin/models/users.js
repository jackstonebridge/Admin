angular.module('proton.admin')
.factory('users', ($http, $q, url) => {
    return {
        AddMobileBeta(body) {
            return $http.post(url.get() + '/admin/mobile', body);
        },
        CreditUser(user_id, body) {
            return $http.put(url.get() + '/admin/user/' + user_id + '/credit', body);
        },
        DeleteInvite(invite_id) {
            return $http.delete(url.get() + '/admin/invite/' + invite_id);
        },
        DeleteOrganization(organization_id) {
            return $http.delete(url.get() + '/admin/organization/' + organization_id);
        },
        DeletePaymentsMethod(user_id, payment_method_id) {
            return $http.delete(url.get() + '/admin/payments/method/' + user_id + '?PaymentMethodID=' + payment_method_id);
        },
        DeleteUser(user_id, force) {
            return $http.delete(url.get() + '/admin/user/' + user_id + '?Force=' + force);
        },
        DisableTwoFactor(user_id) {
            return $http.delete(url.get() + '/admin/user/' + user_id + '/2fa');
        },
        DisableUser(user_id) {
            return $http.put(url.get() + '/admin/user/' + user_id + '/disable');
        },
        EnableUser(user_id) {
            return $http.put(url.get() + '/admin/user/' + user_id + '/enable');
        },
        LogoutUser(user_id) {
            return $http.put(url.get() + '/admin/user/' + user_id + '/logout');
        },
        GetInvoice(invoice_id) {
            var params = { responseType:'arraybuffer' };
            return $http.get(url.get() + '/admin/invoice/' + invoice_id, params);
        },
        GetUserMessages(user_id, location, page, page_size, unread) {
            return $http.get(url.get() + '/admin/user/' + user_id + '/messages?Location=' + location + '&Page=' + page + '&PageSize=' + page_size + '&Unread=' + unread);
        },
        GetUserLogs(user_id) {
            return $http.get(url.get() + '/admin/user/' + user_id + '/logs');
        },
        GetUserPayments(user_id) {
            return $http.get(url.get() + '/admin/user/' + user_id + '/payments');
        },
        PromoteUser(user_id) {
            return $http.put(url.get() + '/admin/user/' + user_id + '/admin');
        },
        ResetLoginPassword(user_id) {
            return $http.put(url.get() + '/admin/user/' + user_id + '/password');
        },
        ResetLogs(user_id) {
            return $http.put(url.get() + '/admin/user/' + user_id + '/logs');
        },
        ResetReputation(user_id) {
            return $http.put(url.get() + '/admin/user/' + user_id + '/reputation');
        },
        ResetSentRate(user_id, body) {
            return $http.put(url.get() + '/admin/user/' + user_id + '/sentrate', body);
        },
        ResetUserPasswordRecovery(user_id) {
            return $http.put(url.get() + '/admin/user/' + user_id + '/recovery');
        },
        SendInvite(user_id) {
            return $http.post(url.get() + '/admin/invite/' + user_id + '/send');
        },
        UpdateLevel(user_id, body) {
            return $http.put(url.get() + '/admin/user/' + user_id + '/level', body);
        },
        UpdateNotificationEmail(user_id, body) {
            return $http.put(url.get() + '/admin/user/' + user_id + '/noticeemail', body);
        },
        UpdateInviteEmail(invite_id, body) {
            return $http.put(url.get() + '/admin/invite/'+ invite_id + '/email', body);
        },
        UserInfo() {
            return $http.get(url.get() + '/admin/users');
        }
    };
});
