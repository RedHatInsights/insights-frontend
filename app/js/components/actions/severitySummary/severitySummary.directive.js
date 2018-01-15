'use strict';

const componentsModule = require('../../');

function fakeAsync(fn) {
    window.setTimeout(fn, 1);
}

/**
 * @ngInject
 */
function SeveritySummaryCtrl($scope) {
    $scope.loaded = false;

    $scope.ruleCount = {
        total: 0,
        info: 0,
        warn: 0,
        error: 0,
        critical: 0
    };

    $scope.max = 0;

    window.test = $scope;

    $scope.$watchCollection('stats.rules', function (value) {
        if (!value) {
            return;
        }

        $scope.loaded = false;
        fakeAsync(() => {
            $scope.ruleCount = value;
            $scope.max = Math.max(value.info, value.warn, value.error, value.critical);
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
