angular.module('proton.authentication')
.factory('helpLoginModal', (pmModal) => {
    return pmModal({
        controllerAs: 'ctrl',
        templateUrl: 'templates/modals/helpLoginModal.tpl.html',
        controller(params) {
            const self = this;
            self.cancel = () => {
                params.close();
            };
        }
    });
});
