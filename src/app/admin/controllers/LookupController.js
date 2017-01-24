angular.module('proton.admin')
.controller(
    'LookupController',
    function($rootScope, $state, $stateParams, $q, lookups, adminFactory) {
        var vm = this;

        vm.IsAdmin = adminFactory.IsAdmin();
        vm.IsSuper = adminFactory.IsSuper();
        vm.Username = adminFactory.GetUserName();

        vm.LookupString = $stateParams.query;
        vm.MultilookupInput = null;
        vm.Responses = [];
        vm.Template = null;

        vm.FuzzyOptions = [
            { label: "Fuzzy match: OFF"  , value: 0 },
            { label: "Fuzzy match: RIGHT", value: 1 },
            { label: "Fuzzy match: LEFT" , value: 2 },
            { label: "Fuzzy match: ALL"  , value: 3 }
        ];
        vm.CurrentFuzzyOption = vm.FuzzyOptions[0];

        vm.lookup = (value) => {
            value = value || vm.LookupString.trim();
            if (!value || value.length === 0) {
                $rootScope.$emit('addAlert', 'Lookup string is empty.');
                // throw true;
            }
            return value;
        };

        vm.LookupUser = (value = '') => {
            value = vm.lookup(value);
            $state.go(
                'private.lookupUser',
                { query: value },
                { reload: true }
            );
        };

        vm.LookupOrganization = (value = '') => {
            value = vm.lookup(value);
            $state.go(
                'private.lookupOrganization',
                { query: value },
                { reload: true }
            );
        };

        vm.LookupDomain = (value = '') => {
            value = vm.lookup(value);
            $state.go(
                'private.lookupDomain',
                { query: value },
                { reload: true }
            );
        };

        vm.LookupCharge = (value = '') => {
            value = vm.lookup(value);
            $state.go(
                'private.lookupCharge',
                { query: value },
                { reload: true }
            );
        };

        vm.StateUser = (value = '') => {
            value = vm.lookup(value);
            lookups.LookupUser(value)
            .then(({data}) => {
                vm.Response = data;
            });
        };

        vm.StateOrganization = (value = '') => {
            value = vm.lookup(value);
            lookups.LookupOrganization(value)
            .then(({data}) => {
                vm.Response = data;
            });
        };

        vm.StateDomain = (value = '') => {
            value = vm.lookup(value);
            lookups.LookupDomain(value)
            .then(({data}) => {
                vm.Response = data;
            });
        };

        vm.StateCharge = (value = '') => {
            value = vm.lookup(value);
            lookups.LookupCharge(value)
            .then(({data}) => {
                vm.Response = data;
            });
        };

        // CSV MultiLookup Parsing
        var multilookup = (callback) => {
            var promises = [];
            var parsed = Papa.parse(vm.MultilookupInput);

            for(var i = 0; i < parsed.data.length; i++)
            {
                var query = parsed.data[i][0];
                promises.push(callback(query));
            }

            $q.all(promises);
        };

        vm.MultilookupUser = () => {
            vm.Responses = [];
            var callback = (value) => {
                vm.Template = 'User';
                lookups.LookupUser(value)
                .then(({data}) => {
                    vm.Responses.push(data);
                });
            };
            multilookup(callback);
        };

        vm.MultilookupOrganization = () => {
            var callback = (value) => {
                vm.Template = 'Organization';
                lookups.LookupOrganization(value)
                .then(({data}) => {
                    vm.Responses.push(data);
                });
            };
            multilookup(callback);
        };

        vm.MultilookupDomain = () => {
            var callback = (value) => {
                vm.Template = 'Domain';
                lookups.LookupDomain(value)
                .then(({data}) => {
                    vm.Responses.push(data);
                });
            };
            multilookup(callback);
        };

        vm.MultilookupCharge = () => {
            var callback = (value) => {
                vm.Template = 'Charge';
                lookups.LookupCharge(value)
                .then(({data}) => {
                    vm.Responses.push(data);
                });
            };
            multilookup(callback);
        };

        var initialize = () => {
            if ($stateParams.query) {
                switch($state.current.name) {
                    case 'private.lookupUser':
                        vm.StateUser($stateParams.query);
                        break;
                    case 'private.lookupOrganization':
                        vm.StateOrganization($stateParams.query);
                        break;
                    case 'private.lookupDomain':
                        vm.StateDomain($stateParams.query);
                        break;
                    case 'private.lookupCharge':
                        vm.StateCharge($stateParams.query);
                        break;
                    // default:
                    //     vm.LookupUser($stateParams.query);
                    //     break;
                }
            }
        };
        initialize();
    });
