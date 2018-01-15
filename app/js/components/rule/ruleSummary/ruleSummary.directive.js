'use strict';

var componentsModule = require('../../');

/**
 * @ngInject
 */
function RuleSummaryCtrl(
    $scope,
    InsightsConfig) {
    $scope.config = InsightsConfig;

    // this needs to be an object so that it can be accessed from the transcluded scope
    $scope.show = {
        moreInfo: false
    };

    $scope.initCollapsed = false;

    if (($scope.ruleFilter && $scope.ruleId && $scope.ruleId !== $scope.report.rule_id) ||
        (!$scope.ruleFilter && !$scope.ruleId)) {
        $scope.initCollapsed = true;
    }

    $scope.resetShowMore = function (ctx) {
        if (ctx.collapsing) {
            $scope.show.moreInfo = false;
        }
    };
}

function ruleSummary() {
    return {
        controller: RuleSummaryCtrl,
        templateUrl: 'js/components/rule/ruleSummary/ruleSummary.html',
        restrict: 'E',
        scope: {
            report: '=',
            rule: '=',
            ruleId: '=',
            ruleFilter: '=',
            loading: '='
        }
    };
}

componentsModule.directive('ruleSummary', ruleSummary);
