/*global require*/
'use strict';

var componentsModule = require('../../');

/**
 * @ngInject
 */
function logsPatchInfoCtrl() {
}

/**
 * @ngInject
 */
function logsPatchInfo() {
    return {
        templateUrl: 'js/components/patchLogs/patchInfo/logsPatchInfo.html',
        restrict: 'E',
        replace: true,
        transclude: true,
        controller: logsPatchInfoCtrl
    };
}

componentsModule.directive('logsPatchInfo', logsPatchInfo);
