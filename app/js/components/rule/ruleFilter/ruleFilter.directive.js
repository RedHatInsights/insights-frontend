'use strict';

var componentsModule = require('../../');

/**
 * @ngInject
 */
function ruleFilterCtrl($scope, FilterService) {
    $scope.getShowFilters = FilterService.getShowFilters;
    $scope.getSelectedProduct = FilterService.getSelectedProduct;
    $scope.filter = FilterService;

    $scope.validSummaryFields =
        ['product', 'category', 'osp_deployment', 'docker_host', 'role'];
}

function ruleFilter() {
    return {
        templateUrl: 'js/components/rule/ruleFilter/ruleFilter.html',
        restrict: 'E',
        controller: ruleFilterCtrl
    };
}

componentsModule.directive('ruleFilter', ruleFilter);
