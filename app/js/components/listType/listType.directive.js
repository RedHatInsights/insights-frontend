/*global require*/
'use strict';

var componentsModule = require('../');

/**
 * @ngInject
 */
function ListTypeCtrl($scope, ListTypeService) {
    $scope.setListType = ListTypeService.setType;
    $scope.getListType = ListTypeService.getType;
    $scope.listTypes = ListTypeService.types();
}

/**
 * @ngInject
 */
function listType() {
    return {
        templateUrl: 'js/components/listType/listType.html',
        restrict: 'E',
        replace: true,
        transclude: true,
        controller: ListTypeCtrl
    };
}

componentsModule.directive('listType', listType);
