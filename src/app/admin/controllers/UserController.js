angular.module('proton.admin')
.controller(
    'UserController',
    function($rootScope, $state, $controller, users, authFactory, lookupFactory, userFactory) {
        var vm = this;

        vm.IsAdmin = authFactory.IsAdmin();
        vm.IsSuper = authFactory.IsSuper();

        vm.InviteID = null;
        vm.InviteEmail = null;

        vm.UserID = null;

        vm.NotificationEmail = null;

        vm.DeleteUserOptions = [
            { label: "Soft delete"  , value: 0 },
            { label: "Forced delete", value: 1 },
            { label: "Never existed", value: 2 }
        ];
        vm.CurrentDeleteUserOption = vm.DeleteUserOptions[0];

        vm.ResetUserSentRateOptions = [
            { label: "Reset outdated", value: 0 },
            { label: "Reset ban"     , value: 1 },
            { label: "Reset all"     , value: 2 }
        ];
        vm.CurrentResetUserSentRateOption = vm.ResetUserSentRateOptions[1];

        vm.LookupOrganization = (value) => {
            $state.go(
                'private.lookupOrganization',
                { query: value },
                { reload: true }
            );
        };

        vm.AddMobileBeta = (instance) => {
            var body = {
                "UserIDs": [instance.User.ID]
            };
            users.AddMobileBeta(body)
            .then(() => {
                $rootScope.$emit('addAlert', 'User ' + vm.LookupString + ' added to mobile beta.');
            });
        };

        vm.CreditUser = (instance, value = 0) => {
            var body = {
                "Credit": value * 100,
                "Description": "Admin panel credit adjustment"
            };
            users.CreditUser(instance.User.ID, body)
            .then(() => {
                $rootScope.$emit('addAlert', 'Changed credit value by ' + value + ' for user ' + vm.LookupString + '.');
                $state.reload();
            });
        };

        vm.DeleteInvite = (instance) => {
            users.DeleteInvite(instance.Invite.ID)
            .then(() => {
                $rootScope.$emit('addAlert', 'User invite deleted from waiting list.');
                $state.reload();
            });
        };

        vm.DeleteOrganization = (instance) => {
            users.DeleteOrganization(instance.Organization.ID)
            .then(() => {
                $rootScope.$emit('addAlert', 'Organization deleted.');
                $state.reload();
            });
        };

        vm.DeletePaymentsMethod = (instance, payment) => {
            users.DeletePaymentsMethod(instance.User.ID, payment.ID)
            .then(() => {
                $rootScope.$emit('addAlert', 'Payment method deleted.');
                $state.reload();
            });
        };

        vm.DeleteUser = (instance) => {
            users.DeleteUser(instance.User.ID, vm.CurrentDeleteUserOption.value)
            .then(() => {
                $rootScope.$emit('addAlert', 'User ' + vm.LookupString + ' deleted with mode: "' + vm.CurrentDeleteUserOption.label + '" (' + vm.CurrentDeleteUserOption.value + ')');
                $state.reload();
            });
        };

        vm.DisableTwoFactor = (instance) => {
            users.DisableTwoFactor(instance.User.ID)
            .then(() => {
                $rootScope.$emit('addAlert', 'Two-factor uuthentication disabled.');
                $state.reload();
            });
        };

        vm.DisableUser = (instance) => {
            users.DisableUser(instance.User.ID)
            .then(() => {
                $rootScope.$emit('addAlert', 'User ' + vm.LookupString + ' disabled.');
                $state.reload();
            });
        };

        vm.EnableUser = (instance) => {
            users.EnableUser(instance.User.ID)
            .then(() => {
                $rootScope.$emit('addAlert', 'User ' + vm.LookupString + ' enabled.');
                $state.reload();
            });
        };

        vm.LogoutUser = (instance) => {
            users.LogoutUser(instance.User.ID)
            .then(() => {
                $rootScope.$emit('addAlert', 'User logged out.');
            });
        };

        vm.PromoteUser = (instance) => {
            users.PromoteUser(instance.User.ID)
            .then(() => {
                $rootScope.$emit('addAlert', 'User ' + vm.LookupString + ' promoted to admin.');
                $state.reload();
            });
        };

        vm.ResetLoginPassword = (instance) => {
            users.ResetLoginPassword(instance.User.ID)
            .then(() => {
                $rootScope.$emit('addAlert', 'Reset code sent.');
            });
        };

        vm.ResetLogs = (instance) => {
            users.ResetLogs(instance.User.ID)
            .then(() => {
                $rootScope.$emit('addAlert', 'Authentication logging reset to basic.');
                $state.reload();
            });
        };

        vm.ResetSentRate = (instance) => {
            var body =  {
                "Force": vm.CurrentResetUserSentRateOption.value
            };
            users.ResetSentRate(instance.User.ID, body)
            .then(() => {
                $rootScope.$emit('addAlert', 'Sent rate reset with option: "' +  vm.CurrentResetUserSentRateOption.label + '" (' + vm.CurrentResetUserSentRateOption.value + ')');
                $state.reload();
            });
        };

        vm.ResetUserPasswordRecovery = (instance) => {
            users.ResetUserPasswordRecovery(instance.User.ID)
            .then(() => {
                $rootScope.$emit('addAlert', 'User password recovery reset.');
                $state.reload();
            });
        };

        vm.ResetReputation = (instance) => {
            users.ResetReputation(instance.User.ID)
            .then(() => {
                $rootScope.$emit('addAlert', 'Sent rate reset.');
                $state.reload();
            });
        };

        vm.SendInvite = (instance) => {
            users.SendInvite(instance.Invite.ID)
            .then(() => {
                $rootScope.$emit('addAlert', 'Invite sent for ' + vm.LookupString);
            });
        };

        vm.UpdateUserLevel = (instance, level = 1) => {
            var body =  {
                "Level": level
            };
            users.UpdateLevel(instance.User.ID, body)
            .then(() => {
                $rootScope.$emit('addAlert', 'User level changed.');
                $state.reload();
            });
        };

        vm.UpdateNotificationEmail = (instance) => {
            var body =  {
                "NotificationEmail": instance.User.NotificationEmail
            };
            users.UpdateNotificationEmail(instance.User.ID, body)
            .then(() => {
                $rootScope.$emit('addAlert', 'Notification email updated.');
                $state.reload();
            });
        };

        vm.UpdateInviteEmail = (instance) => {
            var body =  {
                "Email": instance.Invite.NotificationEmail
            };
            users.UpdateInviteEmail(instance.Invite.ID, body)
            .then(() => {
                $rootScope.$emit('addAlert', 'Invite email updated.');
                $state.reload();
            });
        };

        vm.ViewUserLogs = (instance) => {
            lookupFactory.SetUserID(instance.User.ID);
            $state.go('private.logs', { query: instance.User.ID });
        };

        vm.ViewUserMessages = (instance) => {
            lookupFactory.SetUserID(instance.User.ID);
            userFactory.SetUser(instance.User);
            $state.go('private.messages', { query: instance.User.ID });
        };

        vm.ViewUserPayments = (instance) => {
            lookupFactory.SetUserID(instance.User.ID);
            $state.go('private.payments', { query: instance.User.ID });
        };
    }
);
