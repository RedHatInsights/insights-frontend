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
    $scope.recTask = `Applying 1.`;
    $scope.recTotal = 4;
    $scope.recDesc = '1. ' + recommendations[0].rule.description;
    $scope.progressPercent = 0;
    $interval(() => {
        $scope.progressPercent++;

        if ($scope.progressPercent >= 60) {
            $scope.recTask = 'Applying:';
            $scope.recDesc = '2. ' + recommendations[1].rule.description;
        }

        if ($scope.progressPercent >= 70) {
            $scope.recTask = 'Applying:';
            $scope.recDesc = '3. ' + recommendations[2].rule.description;
        }

        if ($scope.progressPercent >= 80) {
            $scope.recTask = 'Verifying Remediation:';
            $scope.recDesc = 'Checking in with Insights';
        }
    }, 80, 100).then(() => {
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
