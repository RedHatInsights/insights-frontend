/*global require*/
'use strict';

const componentsModule = require('../../');

/**
 * @ngInject
 */
function applyRecommendationsModalCtrl($scope,
                                       $modalInstance,
                                       $interval,
                                       $timeout,
                                       recommendations) {
    console.log('applyRecommendationsModalCtrl recommendations', recommendations);
    console.log('applyRecommendationsModalCtrl $scope', $scope);
    console.log('applyRecommendationsModalCtrl $scope.resolve', $scope.resolve);
    $scope.recNumber = 1;
    $scope.recTotal = 4;
    $scope.recDesc = recommendations[0].rule.description;
    $scope.progressPercent = 0;
    $interval(() => {
        $scope.progressPercent++;

        if ($scope.progressPercent >= 50) {
            $scope.recNumber = 2;
            $scope.recDesc = recommendations[1].rule.description;
        }

        if ($scope.progressPercent >= 60) {
            $scope.recNumber = 3;
            $scope.recDesc = recommendations[2].rule.description;
        }

        if ($scope.progressPercent >= 90) {
            $scope.recNumber = 4;
            $scope.recDesc = recommendations[3].rule.description;
        }
    }, 50, 100).then(() => {
        $timeout(() => {
            $modalInstance.close();
        }, 1000);
    });

    $scope.close = () => {
        $modalInstance.close();
    };
}

function applyRecommendationsModal() {
    return {
        templateUrl: 'js/components/maintenance/' +
                     'applyRecommendationsModal/applyRecommendationsModal.html',
        restrict: 'E',
        controller: applyRecommendationsModalCtrl,
        replace: true
    };
}

componentsModule.directive(
    'applyRecommendationsModal',
    applyRecommendationsModal
);
componentsModule.controller(
    'applyRecommendationsModalCtrl',
    applyRecommendationsModalCtrl
);
