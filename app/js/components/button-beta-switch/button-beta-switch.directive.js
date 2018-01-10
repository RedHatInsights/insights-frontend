'use strict';

var componentsModule = require('../');

/**
 * @ngInject
 */
function buttonBetaSwitchCtrl($scope, BetaRedirectService) {

    $scope.switchVersion = function (goToBeta) {
        if (goToBeta) {
            BetaRedirectService.goToBeta();
        } else {
            BetaRedirectService.goToStable();
        }
    };

    $scope.switchStatus = function () {
        let status = window.localStorage.getItem('betaOptIn');
        status = status === 'false' ? true : false;
        window.localStorage.setItem('betaOptIn', status);
        $scope.isOptedIn = status;
    };

    $scope.leaveBeta = function () {
        $scope.switchStatus(false);
        $scope.switchVersion(false);
    };

    $scope.isOnBeta = function () {
        return window.insightsGlobal.isBeta;
    };

    $scope.isOptedIn = JSON.parse(window.localStorage.getItem('betaOptIn'));
}

function buttonBetaSwitch() {
    return {
        templateUrl: 'js/components/button-beta-switch/button-beta-switch.html',
        restrict: 'E',
        controller: buttonBetaSwitchCtrl,
        replace: true
    };
}

componentsModule.directive('buttonBetaSwitch', buttonBetaSwitch);
