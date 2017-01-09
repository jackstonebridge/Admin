angular.module('proton.config', [])
.constant('CONFIG', {
    // Production settings
    // debug: false,
    // url: 'https://protonmail.com',
    // apiUrl: 'https://admin-api.protontech.ch',
    // app_version: '0.1.0',
    // api_version: '1',
    // date_version: 'Fri Dec 23 2016',
    // clientID: 'Admin',
    // clientSecret: 'c916d8e8712f96c719acab4ec54e7844'

    // Test settings
    // debug: true,
    // url: 'https://protonmail.com',
    // apiUrl: 'https://test-api.protonmail.ch',
    // app_version: '0.1.0',
    // api_version: '1',
    // date_version: 'Fri Dec 23 2016',
    // clientID: 'Admin',
    // clientSecret: 'c916d8e8712f96c719acab4ec54e7844'

    // Local enviroment settings
    debug: true,
    url: 'https://protonmail.dev',
    // apiUrl: 'http://localhost/api',
    apiUrl: 'http://protonmail.dev/api',
    app_version: '0.1.0',
    api_version: '1',
    date_version: 'Fri Dec 23 2016',
    clientID: 'Admin',
    clientSecret: 'c916d8e8712f96c719acab4ec54e7844'
});
