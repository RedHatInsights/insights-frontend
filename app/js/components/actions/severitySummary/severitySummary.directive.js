/*global require*/
'use strict';

const componentsModule = require('../../');

function fakeAsync(fn) {
    window.setTimeout(fn, 1);
}

function getPercentage(count, total) {
    return 100 * (count / total);
}

function getPercentages(ruleCounts) {
    return {
        low:      getPercentage(ruleCounts.info,     ruleCounts.total),
        medium:   getPercentage(ruleCounts.warn,     ruleCounts.total),
        high:     getPercentage(ruleCounts.error,    ruleCounts.total),
        critical: getPercentage(ruleCounts.critical, ruleCounts.total)
    };
}

/**
 * @ngInject
 */
function SeveritySummaryCtrl($scope) {
    $scope.loaded = false;
    $scope.max = 0;

    $scope.$watchCollection('stats.rules', function (value) {
        if (!value) {
            return;
        }

        $scope.loaded = false;
        fakeAsync(() => {
            $scope.percentages = getPercentages(value);
            $scope.loaded = true;
        });
    });
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
