angular.module('admin.core')
.controller('AdminController', (admins, $rootScope) => {
    var vm = this;
    vm.value = 1;
    vm.GetAdmins = function() {
        $rootScope.loading = true;
        admins.get()
        .then(function successCallback(response) {
            $rootScope.loading = false;
                var error = (response.data.ErrorDescription) ? response.data.ErrorDescription : response.data.Error;
                if (error) {
                    $rootScope.$emit('addAlert', error);
                } else {
                    vm.Admins = response.data.Admins;
                    vm.Supers = response.data.Supers;
                }
        })
        .catch(function errorCallback(response) {
                $rootScope.loading = false;
                if (response) {
                    $rootScope.$emit('addAlert', response);
                }
        });
    };
});
