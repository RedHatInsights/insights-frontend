'use strict';

var componentsModule = require('../../../../');

/**
 * @ngInject
 */
function dockerTypeMultiButtonCtrl($scope, FilterService) {
    $scope.dockerNodeTypes = [{
        label: 'Hosts',
        stateKey: 'inventoryDockerHosts',
        icon: 'fa-ship',
        toggleCallback: function () {
            FilterService.setRolesQueryParam('host', 'inventoryDockerHosts');
            FilterService.doFilter();
        }
    }, {
        label: 'Containers',
        stateKey: 'inventoryDockerContainers',
        icon: 'fa-cube',
        toggleCallback: function () {
            FilterService.setRolesQueryParam('container', 'inventoryDockerContainers');
            FilterService.doFilter();
        }
    }, {
        label: 'Images',
        stateKey: 'inventoryDockerImages',
        icon: 'fa-archive',
        toggleCallback: function () {
            FilterService.setRolesQueryParam('image', 'inventoryDockerImages');
            FilterService.doFilter();
        }
    }];

}

function dockerTypeMultiButton() {
    return {
        templateUrl: 'js/components/filterComponents/productFilters/' +
            'docker/dockerTypeMultiButton/dockerTypeMultiButton.html',
        restrict: 'E',
        replace: false,
        controller: dockerTypeMultiButtonCtrl
    };
}

componentsModule.directive('dockerTypeMultiButton', dockerTypeMultiButton);
