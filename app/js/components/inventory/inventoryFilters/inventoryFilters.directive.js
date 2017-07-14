'use strict';

var componentsModule = require('../../');

function inventoryFilters() {
    return {
        templateUrl: 'js/components/inventory/inventoryFilters/inventoryFilters.html',
        restrict: 'E',
        replace: true
    };
}

componentsModule.directive('inventoryFilters', inventoryFilters);
