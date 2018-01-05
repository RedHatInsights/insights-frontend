'use strict';

var componentsModule = require('../');

/**
 * @ngInject
 */
function betaSwitchButtonCtrl($scope, BetaRedirectService) {

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

function betaSwitchButton() {
    return {
        templateUrl: 'js/components/betaSwitchButton/betaSwitchButton.html',
        restrict: 'E',
        controller: betaSwitchButtonCtrl,
        replace: true
    };
}

componentsModule.directive('betaSwitchButton', betaSwitchButton);
