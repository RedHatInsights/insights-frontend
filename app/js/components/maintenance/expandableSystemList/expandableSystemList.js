'use strict';

var componentsModule = require('../../');

/**
 * @ngInject
 */
function expandableSystemListCtrl ($scope, gettextCatalog, InventoryService) {
    $scope.InventoryService = InventoryService;

    if (!$scope.label) {
        $scope.label = gettextCatalog.getPlural(
            $scope.systems.length,
            '1 System',
            '{{count}} Systems',
            {
                count: $scope.systems.length
            }
        );
    }
}

function expandableSystemList () {
    return {
        templateUrl:
            'js/components/maintenance/expandableSystemList/expandableSystemList.html',
        restrict: 'E',
        controller: expandableSystemListCtrl,
        replace: true,
        scope: {
            systems: '<',
            label: '@?'
        }
    };
}

componentsModule.directive('expandableSystemList', expandableSystemList);
