'use strict';

var componentsModule = require('../../');

/**
 * @ngInject
 */
function actionsBreadcrumbsCtrl($scope, $state, ActionsBreadcrumbs) {
    $scope.crumbs = ActionsBreadcrumbs.crumbs;
    $scope.getCrumbs = ActionsBreadcrumbs.get;

    $scope.crumbClick = function (crumb) {
        $state.go(crumb.state, crumb.params);
    };
}

function actionsBreadcrumbs() {
    return {
        templateUrl: 'js/components/actions/actionsBreadcrumbs/actionsBreadcrumbs.html',
        restrict: 'E',
        replace: false,
        controller: actionsBreadcrumbsCtrl
    };
}

componentsModule.directive('actionsBreadcrumbs', actionsBreadcrumbs);
