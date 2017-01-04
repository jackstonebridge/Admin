angular.module('proton.authentication')
.factory('logoutManager', ($rootScope, userAuth, authStates, userModel) => {

    const callbacks = [];
    const SPECIALS = [authStates.value('loginSetup')];
    const contains = (input = '', key = '') => input.indexOf(key) !== -1;

    $rootScope.$on('$stateChangeStart', (e, state, sParams, previous) => {
        const isNotPrivate = !contains(state.name, authStates.value('authenticated', true));
        const isNotSpecial = !contains(SPECIALS, state.name);

        if (isNotPrivate && isNotSpecial) {
            callbacks.forEach((cb) => cb());

            if ((previous.name === authStates.value('loginUnlock') && state.name === authStates.value('login')) || contains(previous.name, authStates.value('authenticated', true))) {
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
