'use strict';

var componentsModule = require('../');

/**
 * @ngInject
 */
function demoAccountSwitcherCtrl($scope, PermissionService) {

    $scope.demoAccountEnabled = $scope.account_number === '6';

    $scope.toggleDemoAccount = function () {
        if (!$scope.demoAccountEnabled) {
            $scope.accountChange('6');
        } else {
            $scope.accountChange($scope.user.account_number);
        }
    };

    $scope.showDemoSwitcher = function () {
        if ($scope.user && ($scope.user.is_internal || $scope.demoAccountEnabled) &&
            !PermissionService.has($scope.user, PermissionService.PERMS.SU)) {
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
