'use strict';

var statesModule = require('../');

/**
 * @ngInject
 */
function AppCtrl($scope, $rootScope, User, PermissionService) {
    User.asyncCurrent(function (user) {
        $rootScope.isContentManager =
            (PermissionService.has(user, PermissionService.PERMS.CONTENT_MANAGER));
    });
}

statesModule.controller('AppCtrl', AppCtrl);
