angular.module('proton.authentication')
.controller('LoginController', ($rootScope, $state, $scope, $timeout, $location, CONSTANTS, gettextCatalog, notify, helpLoginModal, tempStorage, aboutClient, userAuth, authStates) => {
    $scope.maxPW = CONSTANTS.LOGIN_PW_MAX_LEN;
    $scope.twoFactor = 0;
    $scope.showOld = window.location.hostname !== 'old.protonmail.com';

    // FIXME: this part seems useless or bad coded
    // if ($rootScope.isLoggedIn && $rootScope.isLocked === false && $rootScope.user === undefined) {
    //     try {
    //         $rootScope.user = authentication.fetchUserInfo();
    //     }
    //     catch(err) {
    //         $log.error('appjs',err);
    //         alert(err);
    //     }
    // }

    /**
     * Clean notifications
     */
    function clearErrors() {
        $scope.error = null;
        notify.closeAll();
    }

    /**
     * Set $rootScope.isLoggedIn
     * Needed to handle back button from unlock state
     */
    function setLoggedIn() {
        $rootScope.isLoggedIn = !authStates.is('login');
    }

    /**
     * Focus specific input element
     */
    function focusInput() {
        $timeout(() => { $('input.focus').focus(); });
    }

    /**
     * Focus the password field
     */
    function selectPassword() {
        const input = document.getElementById('password');
        input.focus();
        input.select();
    }

    function selectTwoFactor() {
        const input = document.getElementById('twoFactorCode');
        input.focus();
        input.select();
    }

    /**
    * Detect the #help parameter inside the URL and display the help modal
    */
    function checkHelpTag() {
        if ($location.hash() === 'help') {
            $scope.displayHelpModal();
        }
    }

    /**
     * Detect if the current browser have session storage enable
     * or notify the user
     */
    function testSessionStorage() {
        if (!aboutClient.hasSessionStorage()) {
            notify({ message: gettextCatalog.getString('You are in Private Mode or have Session Storage disabled.\nPlease deactivate Private Mode and then reload the page.\n<a href="https://protonmail.com/support/knowledge-base/enabling-cookies/" target="_blank">More information here</a>.', null, 'Error'), classes: 'notification-danger', duration: '0' });
        }
    }

    /**
     * Detect if the current browser have cookie enable
     * or notify the user
     */
    function testCookie() {
        if (!aboutClient.hasCookie()) {
            notify({ message: gettextCatalog.getString('Cookies are disabled.\nPlease activate it and then reload the page.\n<a href="https://protonmail.com/support/knowledge-base/enabling-cookies/" target="_blank">More information here</a>.', null, 'Error'), classes: 'notification-danger', duration: '0' });
        }
    }

    /**
     * Function called at the initialization of this controller
     */
    function initialization() {
        setLoggedIn();
        focusInput();
        checkHelpTag();
        testSessionStorage();
        testCookie();
        userAuth.autoLogin();
    }


    /**
     * Open login modal to help the user
     */
    $scope.displayHelpModal = () => {
        helpLoginModal.activate({
            params: {
                close() {
                    helpLoginModal.deactivate();
                }
            }
        });
    };

    $scope.enterLoginPassword = () => {
        angular.element('input').blur();
        angular.element('#pm_login').attr({ action: '/*' });
        clearErrors();

        userAuth.login($scope.username, $scope.password)
            .then(({ is2FA } = {}) => {
                if (is2FA) {
                    $scope.twoFactor = 1;
                    $timeout(selectTwoFactor, 100, false);
                }
            })
            .catch(() => {
                $scope.twoFactor = 0;
                $timeout(selectPassword, 100, false);
            });
    };

    $scope.enterTwoFactor = () => {
        userAuth.login2FA($scope.username, $scope.password, $scope.twoFactorCode);
    };

    $scope.unlock = (e) => {

        e.preventDefault();
        // Blur unlock password field
        angular.element('[type=password]').blur();
        // Make local so extensions (or Angular) can't mess with it by clearing the form too early
        const mailboxPassword = $scope.mailboxPassword;

        clearErrors();

        userAuth.unlock(mailboxPassword)
            .catch(() => {
                // clear password for user
                selectPassword();
            });
    };

    $scope.reset = () => {
        if (CONSTANTS.KEY_PHASE > 2) {
            $rootScope.isLoggedIn = false;
            authStates.go('resetPassword');
        } else {
            tempStorage.setItem('creds', $scope.creds);
            authStates.go('reset');
        }
    };

    initialization();
});
