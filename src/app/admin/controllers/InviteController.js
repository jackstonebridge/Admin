angular.module('proton.admin')
.controller('InviteController', function(invites, $rootScope) {
    var vm = this;

    vm.CreateInviteUsername = null;
    vm.CreateInviteEmail = null;

    vm.CreateInvite = () => {
        var body = {
            "Username": vm.CreateInviteUsername,
            "Email"   : vm.CreateInviteEmail
        };

        invites.CreateInvite(body)
        .then(({data}) => {
            $rootScope.$emit('addAlert', 'Invite created for ' + vm.CreateInviteUsername + ' (' + vm.CreateInviteEmail + ')');
            $rootScope.LookupString = data.Email;
            $rootScope.lookup('user');
        });
    };
});
