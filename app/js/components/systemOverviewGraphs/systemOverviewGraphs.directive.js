'use strict';

var componentsModule = require('../');

function systemOverviewGraphsCtrl($scope) {
    $scope.activeTab = 'peerRanking';

    // enables tab hack
    $scope.setActive = function (name) {
        $scope.activeTab = name;
    };
}

function systemOverviewGraphs() {
    return {
        scope: {
            system: '='
        },
        templateUrl: 'js/components/systemOverviewGraphs/systemOverviewGraphs.html',
        restrict: 'E',
        replace: true,
        controller: systemOverviewGraphsCtrl
    };
}

componentsModule.directive('systemOverviewGraphs', systemOverviewGraphs);
