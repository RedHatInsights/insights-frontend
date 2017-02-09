'use strict';

var componentsModule = require('../../');

/**
 * @ngInject
 */
function inventoryFiltersCtrl(
    $scope,
    $rootScope,
    $timeout,
    $location,
    Account,
    SystemsService,
    System,
    MultiButtonService,
    FilterService) {

    $scope.getShowFilters = FilterService.getShowFilters;
    $scope.getSelectedProduct = FilterService.getSelectedProduct;
    $scope.filter = FilterService;

    $scope.MultiButtonService = MultiButtonService;

    $scope.validSummaryFields =
        ['product', 'actions', 'group', 'osp_deployment',
        'docker_host', 'role', 'offline'];

    $scope.doShowEnvironmentFilters = function () {
        var response = false;
        var filterProducts = ['osp', 'rhev', 'docker', 'ocp'];
        if (filterProducts.indexOf(FilterService.getSelectedProduct()) !== -1) {
            response = true;
        }

        return response;
    };
}

function inventoryFilters() {
    return {
        templateUrl: 'js/components/inventory/inventoryFilters/inventoryFilters.html',
        restrict: 'E',
        replace: true,
        controller: inventoryFiltersCtrl
    };
}

componentsModule.directive('inventoryFilters', inventoryFilters);
