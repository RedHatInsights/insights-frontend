'use strict';

const componentsModule = require('../../');

/**
 * @ngInject
 */
function SeveritySummaryCtrl($scope) {
    $scope.loaded = false;
    $scope.ruleCount = {
        total: 0,
        info: 0,
        warn: 0,
        error: 0
    };
    $scope.max = 0;

    $scope.$watch('stats.rules', function (value) {
        if (!value) {
            return;
        }

        $scope.ruleCount = value;
        $scope.max = Math.max(value.info, value.warn, value.error);
        $scope.loaded = true;
    }, true);
}

function severitySummary() {
    return {
        templateUrl: 'js/components/actions/severitySummary/severitySummary.html',
        restrict: 'E',
        scope: {
            stats: '='
        },
        controller: SeveritySummaryCtrl
    };
}

componentsModule.directive('severitySummary', severitySummary);
