'use strict';

var componentsModule = require('../../../../');

/**
 * @ngInject
 */
function dockerHostSelectCtrl($scope, FilterService) {
    $scope.getSelectedDockerHost = FilterService.getSelectedDockerHost;
    $scope.getDockerHosts = FilterService.getDockerHosts;

    $scope.doSelectDockerHost = function (host) {
        FilterService.setSelectedDockerHost(host);
        if (FilterService.getSelectedDockerHost().system_id === 'all') {
            FilterService.setParentNode(null);
        } else {
            FilterService.setParentNode(host.system_id);
        }

        FilterService.doFilter();
    };

}

function dockerHostSelect() {
    return {
        templateUrl: 'js/components/filterComponents/productFilters/' +
            'docker/dockerHostSelect/dockerHostSelect.html',
        restrict: 'E',
        replace: false,
        controller: dockerHostSelectCtrl
    };
}

componentsModule.directive('dockerHostSelect', dockerHostSelect);
