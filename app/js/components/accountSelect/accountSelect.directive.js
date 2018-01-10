/*global window*/
'use strict';

var componentsModule = require('../');

/**
 * @ngInject
 */
function accountSelectCtrl($scope, User, InsightsConfig, Utils, PermissionService) {
    var initialAcct = window.sessionStorage.getItem(InsightsConfig.acctKey);

    // The permission service mangles permissions if
    // you are not internal so I check them manually here.
    $scope.showAccountSelector = function () {
        const user = $scope.user;
        const PERMS = PermissionService.PERMS;
        if (!user || !user.permissions) {
            return false;
        }

        if (user.permissions[PERMS.SU]) {
            return true;
        }

        if (user.permissions[PERMS.ACCOUNT_SWITCHER]) {
            return true;
        }

        return false;
    };

    $scope.Utils = Utils;
    $scope.accountChange = function (acct) {
        if (acct) {
            window.sessionStorage.setItem(InsightsConfig.acctKey, acct);
            window.location.reload();
        }
    };

    $scope.reset = function () {
        if (!$scope.user) {
            return;
        }

        $scope.account_number = $scope.user.account_number;
        if ($scope.user.is_internal) {
            $scope.account_number = ('' + $scope.user.account_number);
        }

        $scope.accountChange($scope.account_number);
    };

    if (window.localStorage.getItem('tapi:demo') === 'true') {
        console.log('Insights is running in demo mode');
        initialAcct = '6';
    }

    if (initialAcct) {
        $scope.account_number = initialAcct;
    }

    User.asyncCurrent(function () {
        $scope.user = User.current;

        if ($scope.isInternal !== $scope.user.is_internal) {
            $scope.isInternal = $scope.user.is_internal;
        }

        if (!initialAcct) {
            $scope.account_number = $scope.user.account_number;
        }
    });

    $scope.changeInternal = function () {
        $scope.user.isInternal = $scope.isInternal;
        window.localStorage.setItem(
            'insights:user:isInternal',
            JSON.stringify($scope.user.isInternal)
        );

        window.location.reload();
    };
}

function accountSelect() {
    return {
        templateUrl: 'js/components/accountSelect/accountSelect.html',
        restrict: 'E',
        replace: true,
        controller: accountSelectCtrl
    };
}

componentsModule.directive('accountSelect', accountSelect);
