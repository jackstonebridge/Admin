angular.module('proton.admin')
.controller('UserController', function($rootScope, $state, $controller, users) {
    var vm = this;
    angular.extend(vm, $controller('LookupController'));

    vm.UserID = null;

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

    vm.CreditUser = (value = 0) => {
        var body = {
            "Credit": value * 100,
            "Description": "Admin panel credit adjustment"
        };
        users.CreditUser(vm.UserID, body)
        .then(() => {
            $rootScope.$emit('addAlert', 'Changed credit value by ' + value + ' for user ' + vm.UserID + '.');
            $state.reload();
        });
    };


});
