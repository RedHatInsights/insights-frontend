/*global require*/
'use strict';

const componentsModule = require('../');

/**
 * @ngInject
 */
function deploymentHeaderCtrl($scope, gettextCatalog) {

    function init() {
        $scope.nameTranslated = gettextCatalog.getString($scope.name);
        $scope.regionTranslated = gettextCatalog.getString($scope.region);
        $scope.typeTranslated = gettextCatalog.getString($scope.type);
    }

    init();
}

function deploymentHeader() {
    return {
        transclude: true,
        templateUrl: 'js/components/deploymentHeader/deploymentHeader.html',
        restrict: 'E',
        replace: true,
        controller: deploymentHeaderCtrl,
        scope: {
            name: '@',
            region: '@',
            type: '@'
        }
    };
}

componentsModule.directive('deploymentHeader', deploymentHeader);
