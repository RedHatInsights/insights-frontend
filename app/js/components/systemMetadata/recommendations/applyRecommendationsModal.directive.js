/*global require*/
'use strict';

const componentsModule = require('../../');

/**
 * @ngInject
 */
function applyRecommendationsModalCtrl($scope, $modalInstance, $interval, $timeout) {
    $scope.recNumber = 1;
    $scope.recTotal = 4;
    $scope.recDesc = 'Updating MTU setting';
    $scope.progressPercent = 0;
    $interval(() => {
        $scope.progressPercent++;

        if ($scope.progressPercent >= 25) {
            $scope.recNumber = 2;
            $scope.recDesc = 'Updating Rec 2';
        }

        if ($scope.progressPercent >= 50) {
            $scope.recNumber = 3;
            $scope.recDesc = 'Updating Rec 3';
        }

        if ($scope.progressPercent >= 75) {
            $scope.recNumber = 4;
            $scope.recDesc = 'Updating Rec 4';
        }
    }, 100, 100).then(() => {
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
