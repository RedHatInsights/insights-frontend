/*global require*/
'use strict';

var componentsModule = require('../../');

/**
 * @ngInject
 */
function rhaTelemetryActionsSideNavCtrl(
        $scope,
        $state,
        $stateParams,
        Stats,
        Categories,
        FilterService) {

    $scope.product = FilterService.getSelectedProduct();
    if ($scope.product === 'all') {
        $scope.product = undefined;
    }

    $scope.categoryCounts = {};
    Stats.getRules({
        product: $scope.product
    }).then(function (res) {
        $scope.categoryCounts = res.data;
    });

    $scope.categories = Categories;
    $scope.actions    = false;
    $scope.isActive   = function (category) {
        return ($scope.actions && $stateParams.id === category);
    };

    $scope.$watch(function () {
        return $state.current && $state.current.actions;
    }, function (actions) {

        $scope.actions = actions;
    });
}

function rhaTelemetryActionsSideNav() {
    return {
        templateUrl: 'js/components/sideNav/actionsSideNav/actionsSideNav.html',
        restrict: 'E',
        replace: true,
        controller: rhaTelemetryActionsSideNavCtrl
    };
}

componentsModule.directive('rhaTelemetryActionsSideNav', rhaTelemetryActionsSideNav);
