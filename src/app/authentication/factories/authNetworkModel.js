angular.module('proton.authentication')
    .factory('authNetworkModel', ($http, $rootScope, url, CONSTANTS, CONFIG, pmcw, cryptoUtils, secureSessionStorage, authModel) => {

        const requestURL = url.build('auth');

        function setAuthCookie({ RefreshToken } = {}) {
            return $http.post(requestURL('cookies'), {
                ResponseType: 'token',
                ClientID: CONFIG.clientID,
                GrantType: 'refresh_token',
                RefreshToken,
                RedirectURI: 'https://protonmail.com',
                State: cryptoUtils.randomString(24)
            })
                .then(({ data = {} } = {}) => {
                    if (data.Code === 1000) {
                        $rootScope.domoArigato = true;
                        authModel.storeData({ SessionToken: data.SessionToken });

                        $rootScope.isLocked = false;
                        $rootScope.doRefresh = true;
                        // forget the old headers, set the new ones
                        return 200;
                    }

                    return Promise.reject({ data });
                })
                .catch((e) => {
                    const { data = {} } = e || {};
                    console.error('setAuthCookie2', data);
                    throw new Error(data.ErrorDescription || 'Error setting authentication cookies.');
                });
        }

        function getRefreshCookie() {

            return $http.post(requestURL('refresh'), {})
                .then(({ data = {} } = {}) => {
                    if (data.SessionToken !== undefined) {
                        $http.defaults.headers.common['x-pm-session'] = data.SessionToken;
                        secureSessionStorage.setItem(CONSTANTS.OAUTH_KEY + ':SessionToken', pmcw.encode_base64(data.SessionToken));
                        return $rootScope.doRefresh = true;
                    }
                    throw data.Error;
                })
                .catch((err) => {
                    console.error(err);
                    throw err;
                });
        }

        function logout() {
            return $http.delete(requestURL());
        }

        return { setAuthCookie, getRefreshCookie, logout };
    });
