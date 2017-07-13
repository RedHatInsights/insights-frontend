'use strict';

var componentsModule = require('../../');

/**
 * @ngInject
 */
function expandableSystemListCtrl ($scope, gettextCatalog, InventoryService) {
    $scope.toggle = function () {
        $scope.limit = ($scope.limit) ? undefined : 3;
    };

    $scope.toggle();
    $scope.InventoryService = InventoryService;
}

function expandableSystemList () {
    return {
        templateUrl:
            'js/components/maintenance/expandableSystemList/expandableSystemList.html',
        restrict: 'E',
        controller: expandableSystemListCtrl,
        replace: true,
        scope: {
            systems: '<'
        }
    };
}

componentsModule.directive('expandableSystemList', expandableSystemList);
