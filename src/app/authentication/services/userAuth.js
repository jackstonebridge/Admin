angular.module('proton.authentication')
    .factory('userAuth', (CONSTANTS, CONFIG, $rootScope, tempStorage, gettextCatalog, notify, pmcw, srp, networkActivityTracker, $state, $http, passwords, upgradePassword, authModel, authNetworkModel, secureSessionStorage, authStates) => {
        let SRP_CONFIG = {};
        let CREDENTIALS = {};

        const clear = () => (CREDENTIALS = {}, SRP_CONFIG = {});
        const notifyError = (message) => notify({ message, classes: 'notification-danger' });
        const dispatch = (type, data = {}) => $rootScope.$emit('auth.user', { type, data });

        $rootScope.$on('auth.user', (e, { type, data = {} }) => {
            switch (type) {
                case 'logout':
                    logout(data);
                    break;
                case 'logout.success':
                    clear();
                    break;
            }
        });

        /**
         * Connect a user ~ step 1
         * @param  {String} Username
         * @param  {String} Password      [description]
         * @param  {String} TwoFactorCode [description]
         * @return {Promise}
         */
        const loginUser = (Username, Password, TwoFactorCode) => {
            if (!Username || !Password) {
                return Promise.reject(new Error('Username and Password are required to login'));
            }

            delete $http.defaults.headers.common.Accept;

            const config = {
                Username,
                ClientID: CONFIG.clientID,
                ClientSecret: CONFIG.clientSecret
            };

            // SRP lib does not accept empty Object and we don't want to RFR yet
            const headers = Object.keys(SRP_CONFIG).length ? SRP_CONFIG : undefined;

            return srp.performSRPRequest('POST', '/auth', config, { Username, Password, TwoFactorCode }, headers)
                .then((resp) => {
                    // Upgrade users to the newest auth version
                    if (resp.authVersion < passwords.currentAuthVersion) {
                        return srp.getPasswordParams(Password)
                            .then((data) => (upgradePassword.store(data), resp));
                    }
                    return resp;
                    // this is a trick! we dont know if we should go to unlock or step2 because we dont have user's data yet. so we redirect to the login page (current page), and this is determined in the resolve: promise on that state in the route. this is because we dont want to do another fetch info here.
                })
                .catch((error) => {
                    // TODO: This is almost certainly broken, not sure it needs to work though?
                    throw new Error(error.error_description);
                });
        };

        /**
         * Connect a user ~ Step 2
         * Redirect the user to the setup (password) or unlock
         * @param  {String} username
         * @param  {String} password
         * @param  {String} TwoFactorCode
         * @return {Promise}
         */
        function loginProcess(username, password, TwoFactorCode) {
            return loginUser(username, password, TwoFactorCode)
                .then(({ data = {} } = {}) => {

                    if (data.Code === 401) {
                        throw new Error(data.ErrorDescription);
                    }

                    // This account is disabled.
                    if (data.Code === 10002) {
                        throw new Error(data.Error || 'Your account has been disabled.');
                    }

                    if (typeof data.PrivateKey === 'undefined') {
                        dispatch('received.credentials', data);
                        return authNetworkModel.setAuthCookie(data)
                            .then(() => {
                                $rootScope.isLoggedIn = true;
                                authStates.go('loginSetup');
                            })
                            .catch((error) => {
                                authStates.go('login');
                                throw new Error(error.message);
                            });
                    }

                    if (data.AccessToken) {
                        $rootScope.isLoggedIn = true;

                        if (data.PasswordMode === 1) {
                            $rootScope.domoArigato = true;
                        }

                        // Store temp values
                        CREDENTIALS = {
                            username, password,
                            authResponse: data
                        };

                        return authStates.go('loginUnlock');
                    }

                    // Nothing
                    if (data.Code === 5003) {
                        return;
                    }

                    if (data.Error) {
                        throw new Error(data.ErrorDescription || data.Error);
                    }

                    throw new Error('Unable to log you in.');
                })
                .catch((error) => {
                    if (error.message === undefined) {
                        throw new Error('Sorry, our login server is down. Please try again later.');
                    }
                    throw error;
                });
        }

        /**
         * Get SRP informations for a user based on the username
         * @param  {String} username
         * @param  {String} password
         * @return {Promise}
         */
        function srpLogin(username, password) {
            return srp.info(username)
                .then(({ data = {} } = {}) => {
                    SRP_CONFIG = { data };
                    if (data.TwoFactor === 0) {
                        // user does not have two factor enabled, we will proceed to the auth call
                        return loginProcess(username, password);
                    }
                    // user has two factor enabled, they need to enter a code first
                    return { is2FA: data.TwoFactor !== 0 };
                });
        }

        /**
         * Main API to login a user
         * Also check input values
         * @param  {String} username
         * @param  {String} password
         * @return {Promise}          [description]
         */
        function login(username = '', password = '') {

            try {
                if (!username || !password) {
                    throw new Error(gettextCatalog.getString('Please enter your username and password', null, 'Error'));
                }

                const passwordEncoded = pmcw.encode_utf8(password);

                if (!passwordEncoded) {
                    throw new Error(gettextCatalog.getString('Your password is missing'));
                }

                if (passwordEncoded.length > CONSTANTS.LOGIN_PW_MAX_LEN) {
                    throw new Error(gettextCatalog.getString('Passwords are limited to ' + CONSTANTS.LOGIN_PW_MAX_LEN + ' characters', null, 'Error'));
                }

                const promise = srpLogin(username.toLowerCase(), password);
                networkActivityTracker.track(promise);
                return promise;
            } catch (e) {
                notifyError(e.message);
                return Promise.reject(e);
            }
        }

        /**
         * Main function to login via 2FA
         * @param  {String} username
         * @param  {String} password
         * @param  {String} TwoFactorCode
         * @return {void}
         */
        function login2FA(username = '', password = '', TwoFactorCode = '') {
            if (!TwoFactorCode.length) {
                return notifyError(gettextCatalog.getString('Please enter your two-factor passcode', null, 'Error'));
            }

            loginProcess(username, password, TwoFactorCode)
                .catch((error) => {
                    notifyError(error.message);
                });
        }

        /**
         * Returns an async promise that will be successful
         * only if the mailbox password proves correct
         * (we test this by decrypting a small blob)
         * @param  {String} pwd                  password
         * @param  {String} options.PrivateKey
         * @param  {String} options.AccessToken
         * @param  {String} options.RefreshToken
         * @param  {String} options.Uid
         * @param  {Number} options.ExpiresIn
         * @param  {String} options.EventID
         * @param  {String} options.KeySalt
         * @return {Promise}
         */
        function unlockWithPassword(pwd, { PrivateKey = '', AccessToken = '', RefreshToken = '', Uid = '', ExpiresIn = 0, EventID = '', KeySalt = '' } = {}) {
            if (pwd) {
                return passwords.computeKeyPassword(pwd, KeySalt)
                    .then((pwd) => pmcw.checkMailboxPassword(PrivateKey, pwd, AccessToken))
                    .then(({ token, password }) => {
                        dispatch('save.password', { value: password });
                        dispatch('received.credentials', {
                            AccessToken: token,
                            RefreshToken, Uid, ExpiresIn, EventID
                        });
                        upgradePassword.send();
                        return 200;
                    })
                    .catch((error) => {
                        console.error(error);
                        throw new Error('Wrong decryption password.');
                    });
            }
            return Promise.reject(new Error('Password is required.'));
        }

        /**
         * Main function to unlock the mailbox of an user
         * @param  {String} mailboxPassword
         * @param  {Object} defaultsAuthResponse custom config (optional)
         * @return {Promise}
         */
        function unlock(mailboxPassword = '', defaultsAuthResponse = {}) {
            const { authResponse = defaultsAuthResponse } = CREDENTIALS || {};
            const promise = unlockWithPassword(mailboxPassword, authResponse)
                .then(() => authNetworkModel.setAuthCookie(authResponse))
                .then(() => dispatch('unlock.success'));
            networkActivityTracker.track(promise);
            return promise;
        }

        /**
         * @return {Boolean}
         */
        function isLoggedIn() {
            return !!Object.keys(CREDENTIALS).length;
        }

        /**
         * Login after the setup
         * @return {void}
         */
        function loginSub() {

            const url = window.location.href;
            const [opt, dom] = url.split('/');
            const domain = `${opt}//${dom}`;
            const login = (event) => {
                if (event.origin !== domain) {
                    return;
                }

                // Remove listener
                window.removeEventListener('message', login);

                dispatch('save.password', {
                    value: event.data.MailboxPassword
                });

                // Continues loading up the app
                authModel.saveAuthData({
                    SessionToken: event.data.SessionToken
                });

                $rootScope.$applyAsync(() => {
                    $rootScope.isSecure = true;
                    $rootScope.isLoggedIn = true;
                });

                // Redirect to inbox
                authStates.go('main');
            };

            window.addEventListener('message', login);
            window.opener.postMessage('ready', domain);
        }

        /**
         * Auto login the user
         *     1. After the signup
         *     2. After access to a member subuser (Key phase === 5)
         *     3. 1 password mode autologin on unlock
         * @return {void}
         */
        function autoLogin() {
            if (authStates.is('loginUnlock')) {

                if (!isLoggedIn()) {
                    return authStates.go('login');
                }

                if (CREDENTIALS.authResponse.PasswordMode === 1) {
                    $rootScope.domoArigato = true;
                    return unlock(CREDENTIALS.password);
                }
                return;
            }

            if (authStates.is('loginSub')) {
                return loginSub();
            }

            if (!CREDENTIALS.username || !CREDENTIALS.password) {
                return (CREDENTIALS = {});
            }

            return srpLogin(CREDENTIALS.username, CREDENTIALS.password)
                .catch((error) => {
                    console.log(error);
                });
        }

        /**
         * Removes all connection data
         * @param {Boolean} redirect - Redirect at the end the user to the login page
         */
        function logout({ redirect, callApi = true }) {
            const sessionToken = secureSessionStorage.getItem(CONSTANTS.OAUTH_KEY + ':SessionToken');
            const uid = secureSessionStorage.getItem(CONSTANTS.OAUTH_KEY + ':Uid');
            const process = () => {
                dispatch('logout.success');
                (redirect === true) && authStates.go('login');
            };

            $rootScope.loggingOut = true;

            if (callApi && (angular.isDefined(sessionToken) || angular.isDefined(uid))) {
                return authNetworkModel.logout().then(process, process);
            }
            process();
        }

        return {
            login, loginUser, login2FA,
            unlock, autoLogin, unlockWithPassword,
            logout, clear
        };
    });
