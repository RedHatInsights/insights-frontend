/*global require*/
'use strict';

const componentsModule = require('../');

/**
 * @ngInject
 */

function optimizationLabelCtrl($scope) {

    switch ($scope.level) {
        case 'low':
            $scope.levelClass = 'label-success';
            $scope.levelText = 'Low';
            break;
        case 'moderate':
            $scope.levelClass = 'label-warning';
            $scope.levelText = 'Moderate';
            break;
        case 'high':
            $scope.levelClass = 'label-danger';
            $scope.levelText = 'High';
            break;
    }

}

function optimizationLabel() {
    return {
        scope: {
            level: '='
        },
        templateUrl: 'js/components/optimizationLabel/optimizationLabel.html',
        restrict: 'E',
        replace: true,
        controller: optimizationLabelCtrl
    };
}

componentsModule.directive('optimizationLabel', optimizationLabel);
