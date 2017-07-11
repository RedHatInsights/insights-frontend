'use strict';

var componentsModule = require('../../');

/**
 * @ngInject
 */
function filterButtonCtrl($scope, FilterService) {
    $scope.getShowFilters = FilterService.getShowFilters;
    $scope.toggleShowFilters = FilterService.toggleShowFilters;
}

function filterButton() {
    return {
        templateUrl: 'js/components/filterComponents/filterButton/filterButton.html',
        restrict: 'E',
        replace: false,
        controller: filterButtonCtrl
    };
}

componentsModule.directive('filterButton', filterButton);
