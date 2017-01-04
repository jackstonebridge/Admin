angular.module('proton.authentication')
    .factory('userModel', (User, $rootScope, $state, pmcw, secureSessionStorage, CONSTANTS, authModel, authStates) => {

        const MODEL = { keys: {} };

        const save = (key, data) => (MODEL[key] = data);
        const read = (key = '') => MODEL[key];
        const get = () => read('user') || {};
        const clear = (key) => {
            MODEL[key] = {};
            if (key === 'user') {
                $rootScope.user = {};
                $rootScope.isLoggedIn = isLoggedIn();
                $rootScope.isLocked = isLocked();
                $rootScope.isSecure = isSecured();

            }
        };

        $rootScope.$on('auth.user', (e, { type, data = {} }) => {
            switch (type) {
                case 'save.password':
                    savePassword(data.value);
                    break;
                case 'logout.success':
                    clear('user');
                    // Clean onbeforeunload listener
                    window.onbeforeunload = undefined;
                    // Disable animation
                    $rootScope.loggingOut = false;
                    // Re-initialize variables
                    $rootScope.domoArigato = false;
                    break;
                case 'unlock.success':
                    $rootScope.isLoggedIn = isLoggedIn();
                    $rootScope.isLocked = isLocked();
                    $rootScope.isSecure = isSecured();
                    authStates.go('main');
                    break;

            }
        });


        const load = () => {
            return User.get()
                .then(({ data = {} } = {}) => {
                    if (data.Code === 1000) {
                        return data.User;
                    }
                    throw new Error(data.Error || 'Error during user request');
                })
                .then((user) => {

                    // Redirect to setup if necessary
                    if (user.Keys.length === 0) {
                        authStates.go('loginSetup');
                        return user;
                    }

                    return user;
                });
        };

        /**
         * Extend default cache of a user to extend the model
         * @param  {Object} opt
         * @return {void}
         */
        function extend(opt = {}) {
            save('user', _.extend({}, read('user'), opt));
        }

        function getPassword() {
            const value = secureSessionStorage.getItem(CONSTANTS.MAILBOX_PASSWORD_KEY);
            return value ? pmcw.decode_utf8_base64(value) : undefined;
        }

        function savePassword(pwd) {
            // Never save mailbox password changes if sub user
            if (read('user') && read('user').OrganizationPrivateKey) {
                return;
            }

            secureSessionStorage.setItem(CONSTANTS.MAILBOX_PASSWORD_KEY, pmcw.encode_utf8_base64(pwd));
        }

        // Whether a user is logged in at all
        function isLoggedIn() {
            const loggedIn = !!authModel.read('SessionToken');
            if (loggedIn === true && !authModel.isHeadersSet()) {
                authModel.setAuthHeaders();
            }

            return loggedIn;
        }

        // Whether the mailbox' password is accessible, or if the user needs to re-enter it
        function isLocked() {
            return isLoggedIn() === false || angular.isUndefined(getPassword());
        }

        function isSecured() {
            return isLoggedIn() && angular.isDefined(getPassword());
        }

        // Return a state name to be in in case some user authentication step is required.
        // This will null if the logged in and unlocked.
        function state() {
            if (isLoggedIn()) {
                return isLocked() ? authStates.value('loginUnlock') : null;
            }
            return authStates.value('login');
        }

        // Redirect to a new authentication state, if required
        function redirectIfNecessary() {
            const newState = state();
            newState && $state.go(newState);
        }

        function isSubUser(user = read('user')) {
            return angular.isDefined(user.OrganizationPrivateKey);
        }

        return {
            save, read, clear,
            load, get, extend,
            isSubUser,
            getPassword, savePassword,
            isLoggedIn, isLocked, isSecured,
            state, redirectIfNecessary
        };
    });
