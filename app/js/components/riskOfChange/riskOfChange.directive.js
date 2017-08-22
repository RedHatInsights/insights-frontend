/*global require*/
'use strict';

const componentsModule = require('../');

function RiskOfChange ($scope) {

    // TODO: remove before merging; temporary until API is merged
    // $scope.changeRisk = 4;
    if (!$scope.changeRisk) {
        $scope.changeRisk = 4;
    }
}

function riskOfChange() {
    return {
        controller: RiskOfChange,
        scope: {
            changeRisk: '<',
            hideLabel: '<'
        },
        templateUrl: 'js/components/riskOfChange/riskOfChange.html',
        restrict: 'E',
        replace: true
    };
}

componentsModule.directive('riskOfChange', riskOfChange);
