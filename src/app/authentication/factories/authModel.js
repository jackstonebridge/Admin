angular.module('proton.authentication')
    .factory('authModel', ($rootScope, secureSessionStorage, CONSTANTS, pmcw, $http) => {
        const STATE_AUTH = {
            headersSet: false,
            model: {}
        };

        const save = (data = {}) => (STATE_AUTH.model = _.extend({}, STATE_AUTH.model, data));
        const read = (key = '') => STATE_AUTH.model[key];
        const clear = () => {
            STATE_AUTH.model = {};
            STATE_AUTH.headersSet = false;
            // Reset $http server
            $http.defaults.headers.common['x-pm-session'] = undefined;
            $http.defaults.headers.common.Authorization = undefined;
            $http.defaults.headers.common['x-pm-uid'] = undefined;
        };

        $rootScope.$on('auth.user', (e, { type, data }) => {
            switch (type) {
                case 'received.credentials':
                    storeData(data);
                    break;
                case 'logout.success':
                    secureSessionStorage.clear();
                    clear();
                    break;
            }
        });

        /**
         * Store auth session informations
         * @param  {Object} data
         * @return {void}
         */
        function storeData(data = {}) {
            if (data.SessionToken) {
                secureSessionStorage.setItem(CONSTANTS.OAUTH_KEY + ':SessionToken', pmcw.encode_base64(data.SessionToken));
                save(data);
            } else {
                secureSessionStorage.setItem(`${CONSTANTS.OAUTH_KEY}:AccessToken`, data.Uid);
                secureSessionStorage.setItem(`${CONSTANTS.OAUTH_KEY}:Uid`, data.AccessToken);
                secureSessionStorage.setItem(`${CONSTANTS.OAUTH_KEY}:RefreshToken`, data.RefreshToken);
                save(_.pick(data, 'Uid', 'AccessToken', 'RefreshToken'));
            }

            setAuthHeaders(data);
        }

        /**
         * These headers are used just once for the /cookies route,
         * then we forget them and use cookies and x-pm-session header instead.
         */
        function setAuthHeaders() {
            STATE_AUTH.headersSet = true;
            // API version
            if (read('SessionToken')) {
                // we have a session token, so we can remove the old stuff
                $http.defaults.headers.common['x-pm-session'] = read('SessionToken');
                $http.defaults.headers.common.Authorization = undefined;
                $http.defaults.headers.common['x-pm-uid'] = undefined;
                secureSessionStorage.removeItem(`${CONSTANTS.OAUTH_KEY}:AccessToken`);
                secureSessionStorage.removeItem(`${CONSTANTS.OAUTH_KEY}:Uid`);
                return secureSessionStorage.removeItem(`${CONSTANTS.OAUTH_KEY}:RefreshToken`);
            }
            // we need the old stuff for now
            $http.defaults.headers.common['x-pm-session'] = undefined;
            $http.defaults.headers.common.Authorization = `Bearer ${read('AccessToken')}`;
            $http.defaults.headers.common['x-pm-uid'] = read('Uid');
        }

        const detectAuthenticationState = () => {
            const session = secureSessionStorage.getItem(CONSTANTS.OAUTH_KEY + ':SessionToken');

            if (session) {
                save({ SessionToken: pmcw.decode_base64(session) });

                // If session token set, we probably have a refresh token, try to refresh
                $rootScope.doRefresh = true;
            }
        };

        const isHeadersSet = () => STATE_AUTH.headersSet;

        return {
            save, read, clear, storeData,
            setAuthHeaders, isHeadersSet,
            detectAuthenticationState
        };
    });
