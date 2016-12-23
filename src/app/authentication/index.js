angular.module('proton.authentication', [
    'proton.constants',
    'proton.utils'
])
// Keep the logoutManager here to lunch it
.run(($rootScope, logoutManager, authModel) => {
    authModel.detectAuthenticationState();
});
