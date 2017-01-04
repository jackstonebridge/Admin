angular.module('proton.authentication')
.factory('loginPasswordModal', ($timeout, pmModal) => {
    return pmModal({
        controllerAs: 'ctrl',
        templateUrl: 'templates/authentication/modals/loginPassword.tpl.html',
        controller(params) {
            const self = this;
            self.loginPassword = '';
            self.twoFactorCode = '';
            self.hasTwoFactor = params.hasTwoFactor;

            $timeout(() => document.getElementById('loginPassword').focus());

            self.submit = () => {
                params.submit(self.loginPassword, self.twoFactorCode);
            };

            self.cancel = () => {
                params.cancel();
            };
        }
    });
});
