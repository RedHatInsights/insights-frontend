'use strict';

var componentsModule = require('../../');

/**
 * @ngInject
 */
function RuleSummariesCtrl(
    $scope,
    $stateParams,
    $location,
    gettextCatalog,
    System,
    Report,
    InsightsConfig) {

    $scope.getLoadingMessage = function () {
        if ($scope.system.toString) {
            return gettextCatalog.getString('Loading report(s) for {{name}}…', {
                name: $scope.system.toString
            });
        }

        return gettextCatalog.getString('Loading report(s)…');
    };

    function getSystemReports() {
        $scope.loading.isLoading = true;
        System.getSystemReports($scope.machineId)
            .success(function (system) {
                angular.extend($scope.system, system);
                if ($scope.rule_id) {
                    $scope.system.reports.sort(function (a, b) {
                        if (a.rule_id === $scope.rule_id) {
                            return -1;
                        } else if (b.rule_id === $scope.rule_id) {
                            return 1;
                        }

                        return 0;
                    });
                }

                $scope.loading.isLoading = false;
            })
            .error(function (data, status, headers, config) {
                if (InsightsConfig.getReportsErrorCallback) {
                    $scope.errorMessage =
                        InsightsConfig.getReportsErrorCallback(
                            data,
                            status,
                            headers,
                            config);
                }

                $scope.loading.isLoading = false;
            });
    }

    // if the rule attribute is set it has precedence. Otherwise use the state param.
    if ($scope.rule) {
        $scope.rule_id = $scope.rule;
    } else {
        $scope.rule_id = $stateParams.rule;
    }

    if ($scope.machineId && !$scope.system.__fake) {
        if ($scope.rule_id) {
            $scope.ruleFilter = true;
        }

        if ($scope.system) {
            $scope.system.reports = [];
            getSystemReports();
        }
    }
}

function ruleSummaries() {
    return {
        controller: RuleSummariesCtrl,
        templateUrl: 'js/components/rule/ruleSummaries/ruleSummaries.html',
        restrict: 'EC',
        scope: {
            system: '=',
            machineId: '=',
            rule: '=',
            ruleFilter: '=',
            loading: '='
        }
    };
}

componentsModule.directive('ruleSummaries', ruleSummaries);
