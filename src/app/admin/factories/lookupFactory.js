angular.module('proton.admin')
.factory('lookupFactory', () => {
    var user_id = null;
    var organization_id = null;
    var domain_id = null;

    function SetUserID(id) {
        user_id = id;
    }
    function SetOrganizationID(id) {
        user_id = id;
    }
    function SetDomainID(id) {
        user_id = id;
    }

    function GetUserID() {
        return user_id;
    }
    function GetOrganizationID() {
        return organization_id;
    }
    function GetDomainID() {
        return domain_id;
    }

    return {
        SetUserID,
        SetOrganizationID,
        SetDomainID,
        GetUserID,
        GetOrganizationID,
        GetDomainID
    };
});
