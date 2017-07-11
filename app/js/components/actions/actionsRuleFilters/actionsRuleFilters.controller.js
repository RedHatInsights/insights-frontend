'use strict';

var componentsModule = require('../../');

/**
 * @ngInject
 */
function actionsRuleFiltersCtrl($scope, FilterService, Events, Group) {
    $scope.getShowFilters = FilterService.getShowFilters;
    $scope.getSelectedProduct = FilterService.getSelectedProduct;
    $scope.validSummaryFields = ['product', 'group', 'osp_deployment', 'docker_host'];

    $scope.resetFilters = function () {
        FilterService.clearAll();
        Group.setCurrent({});
        $scope.$emit('group:change', {});
        $scope.$broadcast(Events.filters.reset);
    };
}

function actionsRuleFilters() {
    return {
        templateUrl: 'js/components/actions/actionsRuleFilters/actionsRuleFilters.html',
        restrict: 'E',
        replace: false,
        controller: actionsRuleFiltersCtrl
    };
}

componentsModule.directive('actionsRuleFilters', actionsRuleFilters);
