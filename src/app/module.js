angular.module('RDash', [
    'ui.bootstrap',
    'ui.router',
    'ngCookies',
    'ngResource',
    'gettext',
    'cgNotify',
    'admin.core',
    'proton.config',
    'proton.models',
    'proton.authentication'
])
.config(
    function (urlProvider, authStatesProvider, CONFIG) {
        urlProvider.setBaseUrl(CONFIG.apiUrl);
        authStatesProvider.config({
            main: 'lookup',
            login: 'login',
            loginSub: 'login.sub',
            loginSetup: 'login.setup',
            loginUnlock: 'login.unlock',
            resetPassword: 'support.reset-password',
            reset: 'reset'
        });
    }
);
