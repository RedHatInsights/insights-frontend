/*global require*/
'use strict';

const componentsModule = require('../');
const priv = {};

/**
 * @ngInject
 */
function gaugeMarkerController($scope, gettextCatalog) {
    priv.getString = (str) => {
        return str + ' ' + $scope.difference + ' ' + gettextCatalog.getString('points');
    };

    priv.init = () => {
        $scope.rotate = (($scope.current - 250) * 0.3);

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
            $scope.diffClass = 'neutral';
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
