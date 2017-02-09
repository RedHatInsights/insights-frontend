/*global require*/
'use strict';

var componentsModule = require('../');

/**
 * @ngInject
 */
function TopbarCtrl($scope, InsightsConfig) {
    $scope.isPortal = InsightsConfig.isPortal;
}

/**
 * @ngInject
 */
function topbar() {
    return {
        templateUrl: 'js/components/topbar/topbar.html',
        restrict: 'E',
        controller: TopbarCtrl,
        replace: true
    };
}

componentsModule.directive('topbar', topbar);
