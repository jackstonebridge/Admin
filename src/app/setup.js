/**
 * Configs
 */
angular
.module('RDash')
.constant('Setup',
{
    // Production settings
    // debug       : false,
    // appVersion  : 'Other',
    // clientId    : 'B0SS',
    // clientSecret: 'c916d8e8712f96c719acab4ec54e7844',
    // apiUrl      : 'https://admin-api.protontech.ch'
    // apiUrl      : 'https://test-api.protonmail.ch'

    // Local enviroment settings
    debug       : true,
    appVersion  : "Other",
    clientId    : "demoapp",
    clientSecret: "demopass",
    apiUrl      : "http://protonmail.dev/api"
});
