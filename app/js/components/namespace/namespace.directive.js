'use strict';

var componentsModule = require('../');

/**
 * @ngInject
 */
function insightsNamespacerCtrl($scope, $state) {
    var routeClass = this; //jshint ignore:line
    $scope.$on('$stateChangeSuccess', function () {
        routeClass.current = 'insights-' + ($state.current.name).replace(/\./g, '-');
    });
}

function insightsNamespacer() {
    return {
        restrict: 'A',
        controller: insightsNamespacerCtrl,
        controllerAs: 'insightsNamespacer'
    };
}

componentsModule.directive('insightsNamespacer', insightsNamespacer);
