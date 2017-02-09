'use strict';

var servicesModule = require('./');

var PERMS = {
    SU: 'SU',
    INTERNAL: 'INTERNAL',
    CREATE_ANNOUNCEMENT: 'CREATE_ANNOUNCEMENT',
    ACCOUNT_SWITCHER: 'ACCOUNT_SWITCHER',
    CONTENT_MANAGER: 'CONTENT_MANAGER'
};

function PermissionService() {

    function has(user, permission) {
        if (!user || !user.permissions) {
            return false;
        }

        if (!user.is_internal) {
            return false;
        }

        if (user.permissions[PERMS.SU]) {
            return true;
        }

        if (user.permissions[permission]) {
            return true;
        }

        return false;
    }

    return {
        has: has,
        PERMS: PERMS
    };
}

servicesModule.service('PermissionService', PermissionService);
