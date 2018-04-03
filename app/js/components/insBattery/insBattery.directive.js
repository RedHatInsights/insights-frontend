/*global require*/
'use strict';

const componentsModule = require('../');
const capitalize = require('lodash/capitalize');

/**
 * @ngInject
 */

//TODO turn this into a static 3 bar icon to do 1/2/3/4 bars according.
function insBatteryCtrl($scope) {

    $scope.$watch('status', function (status) {
        switch (status) {
            case 'high':
                $scope.statusClass = 'ins-battery-4';
                break;
            case 'moderate':
                $scope.statusClass = 'ins-battery-3';
                break;
            case 'low':
                $scope.statusClass = 'ins-battery-2';
                break;
            case 'critical':
                $scope.statusClass = 'ins-battery-1';
                break;
        }

        $scope.tooltipStatus = capitalize(status);

        if ($scope.label) {
            $scope.tooltip = $scope.label + ': ' + $scope.tooltipStatus;
        } else {
            $scope.tooltip = $scope.type + ': ' + $scope.tooltipStatus;
        }
    });
}

function insBattery() {
    return {
        scope: {
            status: '@',
            label: '@',
            type: '@'
        },
        templateUrl: 'js/components/insBattery/insBattery.html',
        restrict: 'E',
        replace: true,
        controller: insBatteryCtrl
    };
}

componentsModule.directive('insBattery', insBattery);
