angular.module('proton.admin')
    .factory('userFactory', () => {
        var user = null;

        var initialize = () => {
            flaggedPotentialSpammer();
        };

        var SetUser = (data) => {
            user = data;
            initialize();
        };

        var GetUser = () => {
            return user;
        };

        var generateRandomPassword = () => {
            return Math.random().toString(36).slice(-8) + '' + Math.random().toString(36).slice(-8);
        };

        var flaggedPotentialSpammer = function() {
            var seconds_left = user.SentRate.BanTime - Math.floor(Date.now() / 1000) + 604800;
            if (seconds_left > 0) {
                user.IsPotentialSpammer = 1;
            }
            if (user.SentRate.HourlyRecipients >= (user.SentRate.Reputation - 2)) {
                user.IsPotentialSpammer = 1;
            }
            if (user.SentRate.Blackhole > 0) {
                user.IsPotentialSpammer = 1;
            }
            user.IsPotentialSpammer = 0;
        };

        return {
            SetUser,
            GetUser
        };
    });
