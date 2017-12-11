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

    $scope.stateCheck = function () {
        if ($scope.state.is("app.actions") || $scope.state.is("app.inventory") || $scope.state.is("app.actions-rule") || $scope.state.is("app.topic")) {
            return true;
        } else {
            return false;
        }
    };
}

statesModule.controller('AppCtrl', AppCtrl);
