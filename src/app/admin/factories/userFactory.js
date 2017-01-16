angular.module('proton.admin')
.factory('userFactory', (lookups, $q) => {
    var user = null;
    var data = null;

    function set(user1, data1) {
        user = user1;
        data = data1;
    }

    function get(value) {
        if (user) {
            return $q.resolve({user, data});
        }

        return lookups.LookupUser(value)
        .then(({data}) => {
            var user = _.filter(data.Results, function(data) {
                return (data.User || {}).ID == value;
            })[0] || {};
            set(user.User, data);
            return {
                user: user.User, data
            };
        });
    }

    return {
        set, get
    };
});
