angular.module('proton.admin')
.controller(
    'BlastController',
    function($rootScope, users) {
        var vm = this;

        vm.Response = null;

        vm.BlastSubject = null;
        vm.BlastMessage = null;
        vm.BlastMode = false;

        vm.Blast = () => {

            var papaBlastList = Papa.parse(vm.BlastList);
            var List = [];

            for(var i = 0; i < papaBlastList.data.length; i++) {
                var email = papaBlastList.data[i][0];
                List.push(email);
            }

            var data =  {
                "Subject"   : vm.BlastSubject,
                "Body"      : vm.BlastMessage,
                "Except"    : vm.BlastMode,
                "Usernames" : List,
            };

            users.Blast(data)
            .then(({data}) => {
                vm.Response = data;
                if (vm.Response.Responses.length === 0) {
                    $rootScope.$emit('addAlert', 'Message blast sent, there were no errors.');
                } else {
                    var message = '';
                    vm.Response.Responses.forEach(
                        function(rsp) {
                            message += '<p>' + rsp.Error + ': <code>' + rsp.ErrorDescription + '</code></p>';
                        }
                    );
                    $rootScope.$emit('addAlert', message);
                }
            });
        };
    }
);
