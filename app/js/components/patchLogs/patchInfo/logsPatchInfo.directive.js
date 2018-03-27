/*global require*/
'use strict';

var componentsModule = require('../../');
var moment = require('moment');

/**
 * @ngInject
 */
function logsPatchInfoCtrl($scope) {
    $scope.patch1date = moment().subtract(1, 'd').format('MM/DD/YYYY');
    $scope.patch2date = moment().subtract(2, 'd').format('MM/DD/YYYY');
    $scope.patch3date = moment().subtract(3, 'd').format('MM/DD/YYYY');
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
