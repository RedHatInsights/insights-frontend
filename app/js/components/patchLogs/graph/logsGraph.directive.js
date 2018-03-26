/*global require*/
'use strict';

var componentsModule = require('../../');

/**
 * @ngInject
 */
function logsGraphCtrl() {
}

/**
 * @ngInject
 */
function logsGraph() {
    return {
        templateUrl: 'js/components/patchLogs/graph/logsGraph.html',
        restrict: 'E',
        replace: true,
        transclude: true,
        controller: logsGraphCtrl
    };
}

componentsModule.directive('logsGraph', logsGraph);
