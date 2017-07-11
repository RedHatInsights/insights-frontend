'use strict';

var componentsModule = require('../../../');

/**
 * @ngInject
 */
function HighPrioCtrl($scope, System) {
    $scope.loading = true;

    $scope.refresh = function () {
        $scope.loading = true;
        $scope.items = {};
        System.getSystemStatus(true).then(function (res) {
            if (res.data && res.data.stale) {
                $scope.items.staleSystems = res.data.stale;
            }

            $scope.loading = false;
        });
    };

    $scope.itemCount = function () {
        return Object.keys($scope.items).length;
    };

    $scope.$on('account:change', $scope.refresh);

    $scope.refresh();
}

function HighPrio() {
    return {
        templateUrl: 'js/components/overview/widgets/highPrio/highPrio.html',
        restrict: 'E',
        replace: false,
        scope: {},
        controller: HighPrioCtrl
    };
}

componentsModule.directive('highPrio', HighPrio);
