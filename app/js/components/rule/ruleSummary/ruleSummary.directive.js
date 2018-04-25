'use strict';

var componentsModule = require('../../');

/**
 * @ngInject
 */
function RuleSummaryCtrl(
    $scope,
    $location,
    Events,
    InsightsConfig,
    SystemModalTabs) {

    $scope.config = InsightsConfig;

    // this needs to be an object so that it can be accessed from the transcluded scope
    $scope.show = {
        moreInfo: false
    };

    $scope.initCollapsed = false;

    if (($scope.ruleFilter && $scope.ruleId && $scope.ruleId !== $scope.report.rule_id) ||
        (!$scope.ruleFilter && !$scope.ruleId) ||
        ($scope.report.rule_id !== $location.search().selectedRule)) {
        $scope.initCollapsed = true;
    }

    $scope.$watch(function () {
        return $location.search();
    }, function (newVal, oldVal) {
        // don't do anything if it hasn't changed
        if (newVal === oldVal) {
            return;
        }

        let params = $location.search();
        if ($scope.report.rule_id === params.selectedRule &&
            params.activeTab === SystemModalTabs.rules) {
            $scope.$broadcast(Events.cards.toggleCard);
        }
    });

    $scope.goToVulnerabilities = function ($event) {
        const params = $location.search();
        params.activeTab = SystemModalTabs.vulnerabilities;
        $location.search(params);
        $event.stopPropagation();
        $event.preventDefault();
    };

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
