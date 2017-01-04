angular.module('proton.commons')
    .factory('aboutClient', () => {

        const hasSessionStorage = () => {
            const mod = 'modernizr';
            try {
                sessionStorage.setItem(mod, mod);
                sessionStorage.removeItem(mod);
                return true;
            } catch (error) {
                return false;
            }
        };
        const hasCookie = () => navigator.cookieEnabled;
        const getBrowser = () => jQuery.browser.name;
        const getBrowserVersion = () => jQuery.browser.version;

        const prngAvailable = () => {
            if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
                return true;
            } else if (typeof window !== 'undefined' && typeof window.msCrypto === 'object' && typeof window.msCrypto.getRandomValues === 'function') {
                return true;
            }

            return false;
        };

        const findBootstrapEnvironment = () => {
            const envs = ['xs', 'sm', 'md', 'lg'];
            const $el = $('<div>');

            $el.appendTo($('body'));

            for (let i = envs.length - 1; i >= 0; i--) {
                const env = envs[i];

                $el.addClass('hidden-' + env);
                if ($el.is(':hidden')) {
                    $el.remove();
                    return env;
                }
            }
        };

        const getOS = () => {
            let OSName = 'other'; // Unknown OS

            if (navigator.appVersion) {
                if (navigator.appVersion.indexOf('Win') !== -1) {
                    OSName = 'windows';
                }

                if (navigator.appVersion.indexOf('Mac') !== -1) {
                    OSName = 'osx';
                }

                if (navigator.appVersion.indexOf('X11') !== -1) {
                    OSName = 'linux';
                }

                if (navigator.appVersion.indexOf('Linux') !== -1) {
                    OSName = 'linux';

                    if (navigator.appVersion.indexOf('Android') !== -1) {
                        OSName = 'android';
                    }
                }
            }

            if (navigator.userAgent && /(iPad|iPhone|iPod)/g.test(navigator.userAgent)) {
                OSName = 'ios';
            }

            return OSName;
        };

        return {
            hasSessionStorage,
            hasCookie,
            getOS,
            getBrowser,
            getBrowserVersion,
            prngAvailable,
            findBootstrapEnvironment
        };
    });
