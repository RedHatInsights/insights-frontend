'use strict';

var componentsModule = require('../../');

/**
 * @ngInject
 */
function actionsFiltersCtrl($scope, FilterService) {
    $scope.getShowFilters = FilterService.getShowFilters;
    $scope.getSelectedProduct = FilterService.getSelectedProduct;
    $scope.validSummaryFields = [
        'product', 'group', 'severity', 'osp_deployment', 'docker_host'];
}

function actionsFilters() {
    return {
        templateUrl: 'js/components/actions/actionsFilters/actionsFilters.html',
        restrict: 'E',
        controller: actionsFiltersCtrl
    };
}

componentsModule.directive('actionsFilters', actionsFilters);
