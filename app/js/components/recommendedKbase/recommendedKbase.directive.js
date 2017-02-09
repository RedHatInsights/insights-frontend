'use strict';

var componentsModule = require('../');
var solutionCache = {};

/**
 * @ngInject
 */
function recommendedKbaseCtrl($scope, $http, InsightsConfig, StrataService) {
    if (!InsightsConfig.fetchRelatedSolution) {
        // noop.
        return;
    }

    // show label by default
    $scope.showLabel = !angular.isDefined($scope.showLabelParam) || $scope.showLabelParam;

    $scope.loading = false;
    if ($scope.node) {
        if (solutionCache[$scope.node]) {
            $scope.solution = {};
            $scope.solution.viewUri = solutionCache[$scope.node].viewUri;
            $scope.solution.title = $scope.kcsTitle || solutionCache[$scope.node].title;
        } else {
            $scope.loading = true;
            StrataService.searchById($scope.node).then(function (searchResults) {
                if (searchResults.length) {
                    $scope.solution = {};
                    $scope.solution.viewUri =
                        (searchResults[0].viewUri || searchResults[0].view_uri);
                    $scope.solution.title = $scope.kcsTitle || searchResults[0].title;

                    // cache solution before setting title to retain original title
                    solutionCache[$scope.node] = {
                        title: searchResults[0].title,
                        viewUri: $scope.solution.viewUri
                    };
                }
            }).finally(function () {
                $scope.loading = false;
            });
        }
    }
}

function recommendedKbase() {
    return {
        scope: {
            node: '=',
            showLabelParam: '=showLabel',
            kcsTitle: '@'
        },
        templateUrl: 'js/components/recommendedKbase/recommendedKbase.html',
        restrict: 'EC',
        controller: recommendedKbaseCtrl
    };
}

componentsModule.directive('recommendedKbase', recommendedKbase);
