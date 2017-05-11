'use strict';

var componentsModule = require('../');

/**
 * @ngInject
 */
function demoAccountSwitcherCtrl($scope, PermissionService) {
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

    $scope.showDemoSwitcher = function () {
        let user = $scope.user;
        let PERMS = PermissionService.PERMS;

        if (user && !PermissionService.has(user, PERMS.SU) &&
            (user.is_internal || demoAccountEnabled())) {
            return true;
        }

        return false;
    };
}

function demoAccountSwitcher() {
    return {
        templateUrl: 'js/components/demoAccountSwitcher/demoAccountSwitcher.html',
        controller: demoAccountSwitcherCtrl
    };
}

componentsModule.directive('demoAccountSwitcher', demoAccountSwitcher);
