angular.module('proton.admin')
.controller(
    'MessageController',
    function($controller, $stateParams, $rootScope, users, authFactory, userFactory) {
        var vm = this;

        vm.UserID = $stateParams.query;
        vm.IsSuper = authFactory.IsSuper();

        vm.PageSize = 50;
        vm.Page     = 0;
        vm.Unread   = 0;

        vm.MessageLocationOptions = [
            { label: "Inbox"  , value: 0 },
            { label: "Draft"  , value: 1 },
            { label: "Sent"   , value: 2 },
            { label: "Trash"  , value: 3 },
            { label: "Spam"   , value: 4 },
            { label: "Archive", value: 6 }
        ];
        vm.CurrentMessageLocationOption = vm.MessageLocationOptions[0];

        vm.GetUserMessages = () => {
            users.GetUserMessages(vm.UserID, vm.CurrentMessageLocationOption.value, vm.Page, vm.PageSize, vm.Unread)
            .then(({data}) => {
                var user = userFactory.GetUser(vm.UserID);
                if (vm.IsSuper && !user.IsPotentialSpammer) {
                    $rootScope.$emit('addAlert', 'Displaying last 5 messages for super admins');
                } else if (!user.IsPotentialSpammer) {
                    $rootScope.$emit('addAlert', 'User is not flagged as a potential spammer');
                    return;
                }
                vm.Response = data;
            });
        };
        vm.GetUserMessages();
    }
);
