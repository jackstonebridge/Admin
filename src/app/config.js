angular.module('proton.config', [])
.constant('CONFIG', {
    // Production settings
    debug: false,
    apiUrl: 'https://admin-api.protontech.ch',
    app_version: 'Other',
    api_version: '1',
    date_version: 'Fri Dec 23 2016',
    clientID: 'B0SS',
    clientSecret: 'c916d8e8712f96c719acab4ec54e7844'

    // // Test settings
    // debug: true,
    // apiUrl: 'https://test-api.protonmail.ch',
    // app_version: 'Other',
    // api_version: '1',
    // date_version: 'Fri Dec 23 2016',
    // clientID: 'B0SS',
    // clientSecret: 'c916d8e8712f96c719acab4ec54e7844'
    //
    // // Local enviroment settings
    // debug: true,
    // apiUrl: 'http://localhost/api',
    // apiUrl: 'https://protonmail.dev/api',
    // app_version: 'Other',
    // api_version: '1',
    // date_version: 'Fri Dec 23 2016',
    // clientID: 'demoapp',
    // clientSecret: 'demopass'
});
