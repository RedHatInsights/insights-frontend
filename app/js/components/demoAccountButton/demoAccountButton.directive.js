'use strict';

var componentsModule = require('../');

/**
 * @ngInject
 */
function demoAccountButtonCtrl($scope, PermissionService) {
    function demoAccountEnabled() {
        if ($scope.account_number === '6') {
            return true;
        } else {
            return false;
        }
    }

    $scope.toggleDemoText = function () {
        return demoAccountEnabled();

    };

    $scope.toggleDemoAccount = function () {
        let user = $scope.user;

        if (!demoAccountEnabled()) {
            $scope.accountChange('6');
        } else {
            $scope.accountChange(user.account_number);
        }
    };

    $scope.showDemoButton = function () {
        let user = $scope.user;
        let PERMS = PermissionService.PERMS;

        if (user && !PermissionService.has(user, PERMS.SU) &&
            (user.is_internal || demoAccountEnabled())) {
            return true;
        }

        return false;
    };
}

function demoAccountButton() {
    return {
        controller: demoAccountButtonCtrl
    };
}

componentsModule.directive('demoAccountButton', demoAccountButton);
