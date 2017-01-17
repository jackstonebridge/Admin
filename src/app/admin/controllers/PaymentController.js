angular.module('proton.admin')
.controller('PaymentController', function($controller, $stateParams, users) {
    var vm = this;
    angular.extend(vm, $controller('LookupController'));

    vm.UserID = $stateParams.query;

    vm.GetInvoice = (invoice_id) => {
        users.GetInvoice(invoice_id)
        .then((response) => {
            var file = new Blob([response.data], {type: "application/pdf"});
            var fileURL = URL.createObjectURL(file);
            var a         = document.createElement('a');
            a.href        = fileURL;
            a.target      = '_blank';
            a.download    = 'Invoice_' + invoice_id + '.pdf';
            document.body.appendChild(a);
            a.click();
        });
    };

    vm.GetUserPayments = () => {
        users.GetUserPayments(vm.UserID)
        .then(({data}) => {
            vm.Response = data;
        });
    };
    vm.GetUserPayments();
});
