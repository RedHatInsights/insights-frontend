'use strict';

var componentsModule = require('../');

/**
 * @ngInject
 */
function BreadcrumbsCtrl($scope, $state, BreadcrumbsService) {
    $scope.crumbs = BreadcrumbsService.crumbs;
    $scope.getCrumbs = BreadcrumbsService.get;

    $scope.crumbClick = function (crumb) {
        $state.go(crumb.state, crumb.params);
    };
}

function Breadcrumbs() {
    return {
        templateUrl: 'js/components/breadcrumbs/breadcrumbs.html',
        restrict: 'E',
        replace: true,
        controller: BreadcrumbsCtrl
    };
}

componentsModule.directive('breadcrumbs', Breadcrumbs);
