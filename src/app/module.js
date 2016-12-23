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
    function ($httpProvider, urlProvider, authStatesProvider, CONFIG) {
        $httpProvider.defaults.headers.common['x-pm-appversion'] = 'Web_' + CONFIG.app_version;
        $httpProvider.defaults.headers.common['x-pm-apiversion'] = CONFIG.api_version;
        $httpProvider.defaults.headers.common.Accept = 'application/vnd.protonmail.v1+json';
        $httpProvider.defaults.withCredentials = true;

        urlProvider.setBaseUrl(CONFIG.apiUrl);

        authStatesProvider.config({
            main: 'hello',
            loginUnlock: 'hello',
            login: 'index',
            loginSub: 'hello',
            loginSetup: 'hello',
            resetPassword: 'hello',
            reset: 'hello'
        });
    }
);
