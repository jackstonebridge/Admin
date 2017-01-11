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

    const CONFIG = {
        isSimpleLogin: true
    };

    this.config = (config = {}) => {
        Object.keys(config)
            .forEach((key) => {
                STATES[key] = config[key];
            });
    };

    this.fromLoginToMain = (valid = false) => {
        CONFIG.isSimpleLogin = valid;
    };

    this.$get = ($state) => {
        const go = (key, opt = {}) => $state.go(STATES[key], opt);
        const is = (key) => $state.is(STATES[key]);
        const value = (key, isNamespace = false) => (!isNamespace ? STATES[key] : STATES.namespaces[key]);
        const isSimpleLogin = () => CONFIG.isSimpleLogin;
        return { go, is, value, isSimpleLogin };
    };
});
