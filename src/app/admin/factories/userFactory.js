angular.module('proton.admin')
    .factory('userFactory', (lookups) => {
        var data = null;
        var key = null;

        var initialize = () => {
            data.IsPotentialSpammer = flaggedPotentialSpammer();
        };

        var SetUser = (user, user_id) => {
            data = user;
            key = user_id;
            initialize();
        };

        var GetUser = (user_id) => {
            if (data) {
                return data;
            }
            return load(user_id);
        };

        var load = (user_id) => {
            return lookups.LookupUser(user_id)
            .then(({data}) => {
                var user = _.filter(data.Results, function(data) {
                    return (data.User || {}).ID === user_id;
                })[0] || {};
                return {
                    user: user.User
                };
            });
        };

        var generateRandomPassword = () => {
            return Math.random().toString(36).slice(-8) + '' + Math.random().toString(36).slice(-8);
        };

        var flaggedPotentialSpammer = () => {
            var seconds_left = data.SentRate.BanTime - Math.floor(Date.now() / 1000) + 604800;
            if (seconds_left > 0) {
                return 1;
            }
            if (data.SentRate.HourlyRecipients >= (data.SentRate.Reputation - 2)) {
                return 1;
            }
            if (data.SentRate.Blackhole > 0) {
                return 1;
            }
            return 0;
        };

        return {
            SetUser,
            GetUser
        };
    });
