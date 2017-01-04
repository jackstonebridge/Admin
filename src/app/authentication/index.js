angular.module('proton.authentication', [
    'proton.constants',
    'proton.commons',
    'proton.config'
])
.config(($httpProvider, CONFIG) => {
    // Http Intercpetor to check auth failures for xhr requests
    $httpProvider.interceptors.push('authHttpResponseInterceptor');

    $httpProvider.defaults.headers.common['x-pm-appversion'] = 'Web_' + CONFIG.app_version;
    $httpProvider.defaults.headers.common['x-pm-apiversion'] = CONFIG.api_version;
    $httpProvider.defaults.headers.common.Accept = 'application/vnd.protonmail.v1+json';
    $httpProvider.defaults.withCredentials = true;

    // initialize get if not there
    if (angular.isUndefined($httpProvider.defaults.headers.get)) {
        $httpProvider.defaults.headers.get = {};
    }

    // disable IE ajax request caching (don't use If-Modified-Since)
    $httpProvider.defaults.headers.get['Cache-Control'] = 'no-cache';
    $httpProvider.defaults.headers.get.Pragma = 'no-cache';
})
.run(($rootScope, logoutManager, authModel) => {
    // Keep the logoutManager here to lunch it
    authModel.detectAuthenticationState();
});
