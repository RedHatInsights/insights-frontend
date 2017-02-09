'use strict';

var componentsModule = require('../../../../');

/**
 * @ngInject
 */
function rhevTypeMultiButtonCtrl($scope, FilterService, Products) {
    $scope.rhevNodeTypes = [{
        label: 'Deployments',
        stateKey: 'inventoryRHEVDeployments',
        icon: Products.rhev.roles.deployment.icon,
        toggleCallback: function () {
            FilterService.setRolesQueryParam('cluster', 'inventoryRHEVDeployments');
            FilterService.doFilter();
        }
    }, {
        label: 'Managers',
        stateKey: 'inventoryRHEVManagers',
        icon: Products.rhev.roles.manager.icon,
        toggleCallback: function () {
            FilterService.setRolesQueryParam('manager', 'inventoryRHEVManagers');
            FilterService.doFilter();
        }
    }, {
        label: 'Hypervisors',
        stateKey: 'inventoryRHEVHypervisors',
        icon: Products.rhev.roles.hypervisor.icon,
        toggleCallback: function () {
            FilterService.setRolesQueryParam('hypervisor', 'inventoryRHEVHypervisors');
            FilterService.doFilter();
        }
    }];
}

function rhevTypeMultiButton() {
    return {
        templateUrl: 'js/components/filterComponents/productFilters/' +
            'rhev/rhevTypeMultiButton/rhevTypeMultiButton.html',
        restrict: 'E',
        controller: rhevTypeMultiButtonCtrl
    };
}

componentsModule.directive('rhevTypeMultiButton', rhevTypeMultiButton);
