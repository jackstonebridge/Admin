angular.module('proton.admin')
.controller('PaymentController', function($controller, $stateParams, $rootScope, users, adminFactory) {
    var vm = this;
    angular.extend(vm, $controller('LookupController'));

    vm.UserID = $stateParams.query;
    vm.forceMessagesFlag = null;

    vm.messageLocationOptions = [
        { label: "Inbox"  , value: 0 },
        { label: "Draft"  , value: 1 },
        { label: "Sent"   , value: 2 },
        { label: "Trash"  , value: 3 },
        { label: "Spam"   , value: 4 },
        { label: "Archive", value: 6 }
    ];
    vm.currentMessageLocationOption = vm.messageLocationOptions[0];

    vm.flaggedPotentialSpammer = function(SentRate) {
        var seconds_left = SentRate.BanTime - Math.floor(Date.now() / 1000) + 604800;
        if (seconds_left > 0) {
            return 1;
        }
        if (SentRate.HourlyRecipients >= (SentRate.Reputation - 2)) {
            return 1;
        }
        if (SentRate.Blackhole > 0) {
            return 1;
        }
        return 0;
    };

    vm.forceMessages = function() {
        vm.forceMessagesFlag = true;
        vm.GetUserMessages();
    };

    vm.GetUserMessages = (location, page, page_size, unread) => {
        users.GetUserMessages(vm.UserID, location, page, page_size, unread)
        .then(({data}) => {
            vm.Response = data;
            if (!vm.response.data.IsPotentialSpammer)
            {
                $rootScope.$emit('addAlert', 'User is not flagged as a potential spammer');
            }
            if (vm.IsSuper)
            {
                $rootScope.$emit('addAlert', 'Displaying last 5 messages for super admins');
            }
            vm.forceMessagesFlag = false;
        });
    };
    vm.GetUserMessages();
});
