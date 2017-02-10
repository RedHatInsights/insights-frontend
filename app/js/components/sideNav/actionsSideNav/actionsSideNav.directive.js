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
        RhaTelemetryActionsService,
        Categories,
        ActionsBreadcrumbs) {

    $scope.categories = Categories;
    $scope.getCounts  = RhaTelemetryActionsService.getCounts;
    $scope.actions    = false;
    $scope.isActive   = function (category) {
        return ($scope.actions && $stateParams.category === category);
    };

    $scope.onActionsClick = function () {
        ActionsBreadcrumbs.clear();
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
