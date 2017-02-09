'use strict';

var statesModule = require('../');

/**
 * @ngInject
 */
function ConfigCtrl($scope, $state, $stateParams, User, PermissionService) {
    $scope.current = {
        hidden: true
    };

    User.asyncCurrent(function (user) {
        $scope.user = user;
    });

    if ($stateParams.tab) {
        $scope.current.hidden = false;
        $scope.current[$stateParams.tab] = true;
    }

    $scope.tabClick = function (tab) {
        $state.go('app.config', {
            tab: tab
        }, {
            notify: false
        });
    };

    $scope.perms = PermissionService;
}

statesModule.controller('ConfigCtrl', ConfigCtrl);
