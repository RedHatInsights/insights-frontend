/*global require*/
'use strict';

const statesModule = require('../');

/**
 * @ngInject
 */
function ConfigCtrl($scope, $state, $stateParams, User, PermissionService, $rootScope) {
    $scope.current = {
        hidden: true
    };

    $scope.isBeta = $rootScope.isBeta;

    User.asyncCurrent(function (user) {
        $scope.user = user;
    });

    if ($stateParams.tab) {
        $scope.current.hidden = false;
        $scope.current[$stateParams.tab] = true;
    }

    $scope.tabSelected = function (tab) {
        $state.go('app.config', {
            tab
        }, {
            notify: false
        });
    };

    $scope.perms = PermissionService;
}

statesModule.controller('ConfigCtrl', ConfigCtrl);
