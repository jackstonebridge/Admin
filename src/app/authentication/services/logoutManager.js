angular.module('proton.authentication')
.factory('logoutManager', ($rootScope, userAuth, authStates, userModel) => {

    const callbacks = [];
    const SPECIALS = [authStates.value('loginSetup')];
    const contains = (input = '', key = '') => input.indexOf(key) !== -1;

    $rootScope.$on('$stateChangeStart', (e, state, sParams, previous) => {
        const isNotPrivate = !contains(state.name, authStates.value('authenticated', true));
        const isLoggedIn = userModel.isLoggedIn();

        if (!authStates.isSimpleLogin()) {
            const isNotSpecial = !contains(SPECIALS, state.name);

            if (isNotPrivate && isNotSpecial) {
                callbacks.forEach((cb) => cb());

                if ((previous.name === authStates.value('loginUnlock') && state.name === authStates.value('login')) || contains(previous.name, authStates.value('authenticated', true))) {
                    userAuth.clear();
                }
                // Dispatch an event to notify everybody that the user is no longer logged in
                if (isLoggedIn) {
                    $rootScope.$emit('auth.user', { type: 'logout' });
                }
            }
            return;
        }

        // Dispatch an event to notify everybody that the user is no longer logged in
        if (isNotPrivate && isLoggedIn) {
            userAuth.clear();
            return $rootScope.$emit('auth.user', { type: 'logout' });
        }
    });

    const attach = (cb = angular.noop) => callbacks.push(cb);
    return { attach };
});
