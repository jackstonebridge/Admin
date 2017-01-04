angular.module('RDash', [
    'ui.bootstrap',
    'ui.router',
    'ngCookies',
    'ngResource',
    'gettext',
    'cgNotify',
    'admin.core',
    'proton.config',
    'proton.commons',
    'proton.authentication'
])
.config(($httpProvider, urlProvider, authStatesProvider, CONFIG) => {
    $httpProvider.defaults.headers.common['x-pm-appversion'] = 'Web_' + CONFIG.app_version;
    $httpProvider.defaults.headers.common['x-pm-apiversion'] = CONFIG.api_version;
    $httpProvider.defaults.headers.common.Accept = 'application/vnd.protonmail.v1+json';
    $httpProvider.defaults.withCredentials = true;

    urlProvider.setBaseUrl(CONFIG.apiUrl);

    authStatesProvider.config({
        main: 'lookup',
        login: 'index',
        loginSub: 'login.sub',
        loginSetup: 'login.setup',
        loginUnlock: 'login.unlock',
        resetPassword: 'support.reset-password',
        reset: 'reset',
        namespaces: {
             authenticated: 'lookup',
             login: 'index'
        }
    });
});
