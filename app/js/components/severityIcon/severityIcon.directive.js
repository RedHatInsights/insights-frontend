'use strict';

var componentsModule = require('../');

/**
 * @ngInject
 */
function severityIconCtrl($scope) {
    function icon (level) {
        switch (level) {
            case 1:
                return '../images/i_low.svg';
            case 2:
                return '../images/i_med.svg';
            case 3:
                return '../images/i_high.svg';
            case 4:
                return '../images/i_critical.svg';
            default:
                return '';
        }
    }

    $scope.impactIcon = function () {
        // DEBUG remove before shipping
        if (!$scope.rule.rec_impact)     { $scope.rule.rec_impact =     Math.floor(Math.random() * 4) + 1; };
        return icon($scope.rule.rec_impact);
    };

    $scope.probabilityIcon = function () {
        // DEBUG remove before shipping
        if (!$scope.rule.rec_likelihood) { $scope.rule.rec_likelihood = Math.floor(Math.random() * 4) + 1; };
        return icon($scope.rule.rec_likelihood);
    };

    $scope.riskIcon = function () {
        if (typeof $scope.rule.severity !== 'number') {

            // map the strings to sev #s til #s are in place
            return {
                INFO: icon(1),
                WARN: icon(2),
                ERROR: icon(3),
                CRITICAL: icon(4)
            }[$scope.rule.severity];
        }

        return icon($scope.rule.severity);
    };
}

function severityIcon () {
    return {
        scope: {
            rule: '=',
            label: '=',
            impactOnly: '=',
            probabilityOnly: '=',
            riskOnly: '=',
            noLabels: '='
        },
        templateUrl: 'js/components/severityIcon/severityIcon.html',
        restrict: 'EC',
        replace: true,
        controller: severityIconCtrl
    };
}

componentsModule.directive('severityIcon', severityIcon);
