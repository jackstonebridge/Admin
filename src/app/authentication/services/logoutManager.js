angular.module('proton.authentication')
.factory('logoutManager', ($rootScope, userAuth, userModel) => {

    const callbacks = [];
    $rootScope.$on('$stateChangeStart', (e, state, sParams, previous) => {
        const currentState = state.name;
        const specialStates = ['login.setup'];

        if (currentState.indexOf('secured') === -1 && specialStates.indexOf(currentState) === -1) {

            callbacks.forEach((cb) => cb());

            if (previous.name === 'login.unlock' && state.name === 'login') {
                userAuth.clear();
            }
            // Dispatch an event to notify everybody that the user is no longer logged in
            if (userModel.isLoggedIn()) {
                $rootScope.$emit('auth.user', { type: 'logout' });
            }
        }
    });

    const attach = (cb = angular.noop) => callbacks.push(cb);
    return { attach };
});
