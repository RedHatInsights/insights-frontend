'use strict';

var componentsModule = require('../../');
var sortBy = require('lodash/collection/sortBy');

/**
 * @ngInject
 */
function RuleSummaryCtrl(
    $scope,
    Rule,
    Report,
    TimezoneService,
    $state) {

    // this needs to be an object so that is can be accessed from the transcluded scope
    $scope.show = {
        moreInfo: false
    };
    $scope.initCollapsed = false;

    if ($scope.ruleFilter && $scope.ruleId && $scope.ruleId !== $scope.report.rule_id) {
        $scope.initCollapsed = true;
    }

    $scope.resetShowMore = function (ctx) {
        if (ctx.collapsing) {
            $scope.show.moreInfo = false;
        }
    };

    function parsePlan (plan) {
        plan.start = new Date(plan.start);
        plan.end = new Date(plan.end);
        return plan;
    }

    TimezoneService.promise.then(function (timezone) {
        $scope.timezone = timezone;
        if (angular.isDefined($scope.report) &&
            angular.isDefined($scope.report.maintenance_actions)) {

            if ($scope.report.maintenance_actions.length === 1) {
                $scope.maintenance_plan =
                    parsePlan($scope.report.maintenance_actions[0].maintenance_plan);
            } else if ($scope.report.maintenance_actions.length > 1) {
                let plans =
                    sortBy($scope.report.maintenance_actions.map(function (action) {
                        return parsePlan(action.maintenance_plan);
                    }), 'start');

                $scope.maintenance_plan = plans[plans.length - 1];
            }
        }
    });

    $scope.openPlan = function (plan) {
        $state.go('app.maintenance', {
            maintenance_id: plan.maintenance_id
        }, {
            reload: true
        });
    };
}

function ruleSummary() {
    return {
        controller: RuleSummaryCtrl,
        templateUrl: 'js/components/rule/ruleSummary/ruleSummary.html',
        restrict: 'EC',
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
