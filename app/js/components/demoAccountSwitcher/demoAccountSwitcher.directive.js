'use strict';

var componentsModule = require('../');

/**
 * @ngInject
 */
function demoAccountSwitcherCtrl($scope) {

    $scope.$watch('account_number', function (value) {
        $scope.demoAccountEnabled = value === '6';
    });

    $scope.toggleDemoAccount = function () {
        if (!$scope.demoAccountEnabled) {
            $scope.accountChange('6');
        } else {
            $scope.accountChange($scope.user.account_number);
        }
    };

    $scope.showDemoSwitcher = function () {
        return $scope.user && $scope.user.is_internal;
    };
}

function demoAccountSwitcher() {
    return {
        templateUrl: 'js/components/demoAccountSwitcher/demoAccountSwitcher.html',
        controller: demoAccountSwitcherCtrl,
        replace: true
    };
}

componentsModule.directive('demoAccountSwitcher', demoAccountSwitcher);
