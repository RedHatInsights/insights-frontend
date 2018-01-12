/*global require*/
'use strict';

const componentsModule = require('../');
const priv = {};

/**
 * @ngInject
 */
function gaugeMarkerController($scope, gettextCatalog) {

    const MAX_SCORE = 850;
    const MIN_SCORE = 250;

    priv.getString = (str) => {
        return str + ' ' + $scope.difference + ' ' + gettextCatalog.getString('points');
    };

    priv.init = () => {

        // protects against invalid data; current should never be below MIN_SCORE
        if ($scope.current < MIN_SCORE) {
            $scope.current = MIN_SCORE;
        }

        // current should never be above MAX_SCORE
        if ($scope.current > MAX_SCORE) {
            $scope.current = MAX_SCORE;
        }

        if ($scope.difference > 600 || $scope.difference < -600) {
            $scope.difference = 0;
        }

        $scope.rotate = (($scope.current - MIN_SCORE) * 0.3);

        if ($scope.difference > 0) {
            $scope.diffClass = 'increase';
            $scope.tooltip =
                priv.getString(gettextCatalog.getString('Your score has increased by'));
            return;
        } else if ($scope.difference < 0) {
            $scope.diffClass = 'decrease';
            $scope.tooltip =
                priv.getString(gettextCatalog.getString('Your score has decreased by'));
            return;
        } else if ($scope.difference === 0) {
            $scope.diffClass = null;
            $scope.tooltip =
                gettextCatalog.getString('Your score has not changed');
            return;
        }
    };

    $scope.$watch('current', priv.init);
    $scope.$watch('difference', priv.init);
}

function gaugeMarker() {
    return {
        templateUrl: 'js/components/gaugeMarker/gaugeMarker.html',
        restrict: 'E',
        controller: gaugeMarkerController,
        replace: true,
        scope: {
            current: '<',
            difference: '<'
        }
    };
}

componentsModule.directive('gaugeMarker', gaugeMarker);
