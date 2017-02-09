'use strict';

var componentsModule = require('../../../../');

/**
 * @ngInject
 */
function ospTypeMultiButtonCtrl($scope, FilterService, Products) {
    $scope.ospNodeTypes = [{
        label: 'Deployment',
        stateKey: 'inventoryOSPCluster',
        icon: Products.osp.roles.cluster.icon,
        toggleCallback: function () {
            FilterService.setRolesQueryParam('cluster', 'inventoryOSPCluster');
            FilterService.doFilter();
        }
    }, {
        label: 'Director',
        stateKey: 'inventoryOSPDirector',
        icon: Products.osp.roles.director.icon,
        toggleCallback: function () {
            FilterService.setRolesQueryParam('director', 'inventoryOSPDirector');
            FilterService.doFilter();
        }
    }, {
        label: 'Compute',
        stateKey: 'inventoryOSPCompute',
        icon: Products.osp.roles.compute.icon,
        toggleCallback: function () {
            FilterService.setRolesQueryParam('compute', 'inventoryOSPCompute');
            FilterService.doFilter();
        }
    }, {
        label: 'Controller',
        stateKey: 'inventoryOSPController',
        icon: Products.osp.roles.controller.icon,
        toggleCallback: function () {
            FilterService.setRolesQueryParam('controller', 'inventoryOSPController');
            FilterService.doFilter();
        }
    }];
}

function ospTypeMultiButton() {
    return {
        templateUrl: 'js/components/filterComponents/productFilters/' +
            'osp/ospTypeMultiButton/ospTypeMultiButton.html',
        restrict: 'E',
        controller: ospTypeMultiButtonCtrl
    };
}

componentsModule.directive('ospTypeMultiButton', ospTypeMultiButton);
