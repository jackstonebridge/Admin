angular.module('proton.admin')
.controller('UserController', function($rootScope, $state, $controller, users, userFactory) {
    var vm = this;
    angular.extend(vm, $controller('LookupController'));

    vm.InviteID = null;
    vm.InviteEmail = null;

    vm.UserID = null;
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

    vm.messageLocationOptions = [
        { label: "Inbox"  , value: 0 },
        { label: "Draft"  , value: 1 },
        { label: "Sent"   , value: 2 },
        { label: "Trash"  , value: 3 },
        { label: "Spam"   , value: 4 },
        { label: "Archive", value: 6 }
    ];
    vm.currentMessageLocationOption = vm.messageLocationOptions[0];

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
        users.DeleteUser(vm.UserID, vm.CurrentDeleteUserOption)
        .then(() => {
            $rootScope.$emit('addAlert', 'User ' + vm.LookupString + ' deleted with mode ' + vm.CurrentDeleteUserOption);
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

    vm.GetInvoice = () => {
        users.GetInvoice(vm.InvoiceID)
        .then((response) => {
            var file = new Blob([response.data], {type: "application/pdf"});
            var fileURL = URL.createObjectURL(file);
            var a         = document.createElement('a');
            a.href        = fileURL;
            a.target      = '_blank';
            a.download    = 'Invoice_' + vm.InvoiceID + '.pdf';
            document.body.appendChild(a);
            a.click();
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
            $rootScope.$emit('addAlert', 'Sent rate reset.');
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

    vm.UpdateLevel = () => {
        var body =  {
            "Level": vm.Level
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

    vm.ViewUserLogs = (user, value = '') => {
        value = vm.lookup(value);
        userFactory.set(user);
        $state.go('private.logs', { query: value });
    }
});
