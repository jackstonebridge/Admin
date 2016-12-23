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
    function (urlProvider, CONFIG) {
        urlProvider.setBaseUrl(CONFIG.apiUrl); 
    }
);
