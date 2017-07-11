'use strict';

var componentsModule = require('../../../../');

/**
 * @ngInject
 */
function ospDeploymentSelectCtrl($scope, $rootScope, InventoryService, FilterService) {
    $scope.getSelectedOSPDeployment = FilterService.getSelectedOSPDeployment;
    $scope.getOSPDeployments = FilterService.getOSPDeployments;
    $scope.doSelectOSPDeployment = function (deployment) {
        FilterService.setSelectedOSPDeployment(deployment);
        FilterService.doFilter();
    };

}

function ospDeploymentSelect() {
    return {
        templateUrl: 'js/components/filterComponents/productFilters/' +
            'osp/ospDeploymentSelect/ospDeploymentSelect.html',
        restrict: 'E',
        replace: false,
        controller: ospDeploymentSelectCtrl
    };
}

componentsModule.directive('ospDeploymentSelect', ospDeploymentSelect);
