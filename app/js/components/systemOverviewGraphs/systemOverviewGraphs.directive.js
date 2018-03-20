'use strict';

var componentsModule = require('../');

function systemOverviewGraphsCtrl($scope) {
    $scope.activeTab = 'machineLearning';

    // enables tab hack
    $scope.setActive = function (name) {
        $scope.activeTab = name;
    };
}

function systemOverviewGraphs() {
    return {
        scope: {
        },
        templateUrl: 'js/components/systemOverviewGraphs/systemOverviewGraphs.html',
        restrict: 'E',
        replace: true,
        controller: systemOverviewGraphsCtrl
    };
}

componentsModule.directive('systemOverviewGraphs', systemOverviewGraphs);
