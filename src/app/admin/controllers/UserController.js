angular.module('proton.admin')
.controller('UserController', function($rootScope, $state, $controller, users, lookupFactory, adminFactory) {
    var vm = this;
    angular.extend(vm, $controller('LookupController'));

    vm.InviteID = null;
    vm.InviteEmail = null;

    vm.UserID = null;

    vm.Admin = false;
    vm.Super = true;
    // FIXME this does not work
    // vm.Admin = adminFactory.IsAdmin;
    // vm.Super = adminFactory.IsSuper;
    vm.NotificationEmail = null;

    vm.deleteUserOptions = [
        { label: "Soft delete"  , value: 0 },
        { label: "Forced delete", value: 1 },
        { label: "Never existed", value: 2 }
    ];
    vm.currentDeleteUserOption = vm.deleteUserOptions[0];

    vm.resetUserSentRateOptions = [
        { label: "Reset outdated", value: 0 },
        { label: "Reset ban"     , value: 1 },
        { label: "Reset all"     , value: 2 }
    ];
    vm.currentResetUserSentRateOption = vm.resetUserSentRateOptions[1];

    vm.generateRandomPassword = () => {
        return Math.random().toString(36).slice(-8)+''+Math.random().toString(36).slice(-8);
    };

    vm.AddMobileBeta = () => {
        var body = {
            "UserIDs": [vm.UserID]
        };
        users.AddMobileBeta(body)
        .then(() => {
            $rootScope.$emit('addAlert', 'User ' + vm.LookupString + ' added to mobile beta.');
        });
    };

    vm.CreditUser = (value = 0) => {
        var body = {
            "Credit": value * 100,
            "Description": "Admin panel credit adjustment"
        };
        users.CreditUser(vm.UserID, body)
        .then(() => {
            $rootScope.$emit('addAlert', 'Changed credit value by ' + value + ' for user ' + vm.LookupString + '.');
            $state.reload();
        });
    };

    vm.DeleteInvite = () => {
        users.DeleteInvite(vm.InviteID)
        .then(() => {
            $rootScope.$emit('addAlert', 'User invite deleted from waiting list.');
            $state.reload();
        });
    };

    vm.DeleteOrganization = () => {
        users.DeleteOrganization(vm.OrganizationID)
        .then(() => {
            $rootScope.$emit('addAlert', 'Organization deleted.');
            $state.reload();
        });
    };

    vm.DeletePaymentsMethod = () => {
        users.DeletePaymentsMethod(vm.UserID, vm.PaymentMethodID)
        .then(() => {
            $rootScope.$emit('addAlert', 'Payment method deleted.');
            $state.reload();
        });
    };

    vm.DeleteUser = () => {
        users.DeleteUser(vm.UserID, vm.currentDeleteUserOption.value)
        .then(() => {
            $rootScope.$emit('addAlert', 'User ' + vm.LookupString + ' deleted with mode: "' + vm.currentDeleteUserOption.label + '" (' + vm.currentDeleteUserOption.value + ')');
            $state.reload();
        });
    };

    vm.DisableTwoFactor = () => {
        users.DisableTwoFactor(vm.UserID)
        .then(() => {
            $rootScope.$emit('addAlert', 'Two-factor uuthentication disabled.');
            $state.reload();
        });
    };

    vm.DisableUser = () => {
        users.DisableUser(vm.UserID)
        .then(() => {
            $rootScope.$emit('addAlert', 'User ' + vm.LookupString + ' disabled.');
            $state.reload();
        });
    };

    vm.EnableUser = () => {
        users.EnableUser(vm.UserID)
        .then(() => {
            $rootScope.$emit('addAlert', 'User ' + vm.LookupString + ' enabled.');
            $state.reload();
        });
    };

    vm.LogoutUser = () => {
        users.LogoutUser(vm.UserID)
        .then(() => {
            $rootScope.$emit('addAlert', 'User logged out.');
        });
    };

    vm.PromoteUser = () => {
        users.PromoteUser(vm.UserID)
        .then(() => {
            $rootScope.$emit('addAlert', 'User ' + vm.LookupString + ' promoted to admin.');
            $state.reload();
        });
    };

    vm.ResetLoginPassword = () => {
        users.ResetLoginPassword(vm.UserID)
        .then(() => {
            $rootScope.$emit('addAlert', 'Reset code sent.');
        });
    };

    vm.ResetLogs = () => {
        users.ResetLogs(vm.UserID)
        .then(() => {
            $rootScope.$emit('addAlert', 'Authentication logging reset to basic.');
            $state.reload();
        });
    };

    vm.ResetSentRate = () => {
        var body =  {
            "Force": this.currentResetUserSentRateOption.value
        };
        users.ResetSentRate(vm.UserID, body)
        .then(() => {
            $rootScope.$emit('addAlert', 'Sent rate reset with option: "' +  this.currentResetUserSentRateOption.label + '" (' + this.currentResetUserSentRateOption.value + ')');
            $state.reload();
        });
    };

    vm.ResetReputation = () => {
        users.ResetReputation(vm.UserID)
        .then(() => {
            $rootScope.$emit('addAlert', 'Sent rate reset.');
            $state.reload();
        });
    };

    vm.SendInvite = () => {
        users.SendInvite(vm.InviteID)
        .then(() => {
            $rootScope.$emit('addAlert', 'Invite sent for ' + vm.LookupString);
        });
    };

    vm.UpdateLevel = (level = 1) => {
        var body =  {
            "Level": level
        };
        users.UpdateLevel(vm.UserID, body)
        .then(() => {
            $rootScope.$emit('addAlert', 'User level changed.');
            $state.reload();
        });
    };

    vm.UpdateNotificationEmail = () => {
        var body =  {
            "NotificationEmail": vm.NotificationEmail
        };
        users.UpdateNotificationEmail(vm.UserID, body)
        .then(() => {
            $rootScope.$emit('addAlert', 'Notification email updated.');
            $state.reload();
        });
    };

    vm.UpdateInviteEmail = () => {
        var body =  {
            "Email": vm.InviteEmail
        };
        users.UpdateInviteEmail(vm.InviteID, body)
        .then(() => {
            $rootScope.$emit('addAlert', 'Invite email updated.');
            $state.reload();
        });
    };

    vm.ViewUserLogs = () => {
        lookupFactory.SetUserID(vm.UserID);
        $state.go('private.logs', { query: vm.UserID });
    };

    vm.ViewUserMessages = () => {
        lookupFactory.SetUserID(vm.UserID);
        $state.go('private.messages', { query: vm.UserID });
    };

    vm.ViewUserPayments = () => {
        lookupFactory.SetUserID(vm.UserID);
        $state.go('private.payments', { query: vm.UserID });
    };
});
