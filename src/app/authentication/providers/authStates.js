angular.module('proton.authentication')
.provider('authStates', function () {

    const STATES = {
        main: 'secured.inbox',
        login: 'login',
        loginSub: 'login.sub',
        loginSetup: 'login.setup',
        loginUnlock: 'login.unlock',
        resetPassword: 'support.reset-password',
        reset: 'reset',
        namespaces: {
            authenticated: 'secured',
            login: 'login'
        }
    };

    this.config = (config = {}) => {
        Object.keys(config)
            .forEach((key) => {
                STATES[key] = config[key];
            });
    };

    this.$get = ($state) => {
        const go = (key, opt = {}) => $state.go(STATES[key], opt);
        const is = (key) => $state.is(STATES[key]);
        const value = (key, isNamespace = false) => (!isNamespace ? STATES[key] : STATES.namespaces[key]);
        return { go, is, value };
    };
});