angular.module('RDash', [
    'ui.bootstrap',
    'ui.router',
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'gettext',
    'cgNotify',
    'admin.core',
    'proton.config',
    'proton.commons',
    'proton.authentication'
])
.config(($httpProvider, urlProvider, authStatesProvider, CONFIG) => {
    $httpProvider.defaults.headers.common['x-pm-appversion'] = 'Admin_' + CONFIG.app_version;
    $httpProvider.defaults.headers.common['x-pm-apiversion'] = CONFIG.api_version;
    $httpProvider.defaults.headers.common.Accept = 'application/vnd.protonmail.v1+json';
    $httpProvider.defaults.withCredentials = true;

    urlProvider.setBaseUrl(CONFIG.apiUrl);

    authStatesProvider.config({
        main: 'private.lookup',
        login: 'index',
        loginSub: 'index',
        loginSetup: 'index',
        loginUnlock: 'index',
        resetPassword: 'index',
        reset: 'index',
        namespaces: {
             authenticated: 'private',
             login: 'index'
        }
    });
});
