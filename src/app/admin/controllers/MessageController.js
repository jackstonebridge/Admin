angular.module('proton.admin')
.controller('MessageController', function($controller, $stateParams, $rootScope, users, userFactory) {
    var vm = this;
    angular.extend(vm, $controller('UserController'));

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

    vm.forceMessages = function() {
        vm.forceMessagesFlag = true;
        vm.GetUserMessages();
    };

    vm.GetUserMessages = (location, page, page_size, unread) => {
        users.GetUserMessages(vm.UserID, location, page, page_size, unread)
        .then(({data}) => {
            vm.Messages = data;
            var user = userFactory.GetUser();
            console.debug(user);
            if (!user.IsPotentialSpammer)
            {
                $rootScope.$emit('addAlert', 'User is not flagged as a potential spammer');
            }
            if (vm.Super)
            {
                $rootScope.$emit('addAlert', 'Displaying last 5 messages for super admins');
            }
            vm.forceMessagesFlag = false;
        });
    };
    vm.GetUserMessages();
});
