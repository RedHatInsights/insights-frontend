'use strict';

const componentsModule = require('../../');

/**
 * @ngInject
 */
function impactSelectCtrl($location,
                            $rootScope,
                            $scope,
                            ImpactFilters,
                            Events,
                            FilterService) {
    $scope.options = ImpactFilters;

    $scope.select = function (option) {
        $scope.selected = $scope.options[option];
        FilterService.setImpact(option);
        FilterService.doFilter();

        // no need to store filter when not filtering rules.
        if (option === 0) {
            $location.search(Events.filters.impact, null);
        } else {
            $location.search(Events.filters.impact, option);
        }

        $rootScope.$broadcast(Events.filters.tag,
                              getTag(),
                              Events.filters.impact);
        $rootScope.$broadcast(Events.filters.impact);
    };

    function getTag () {
        return $scope.selected.tag;
    }

    function init() {
        let option = $location.search()[Events.filters.impact] ?
            $location.search()[Events.filters.impact] : FilterService.getImpact();

        $scope.selected = $scope.options[option];
        $rootScope.$broadcast(Events.filters.tag,
                              getTag(),
                              Events.filters.impact);
    }

    init();

    $scope.$on(Events.filters.reset, function () {
        $scope.select(0);
    });

    $scope.$on(Events.filters.removeTag, function (event, filter) {
        if (filter === Events.filters.impact) {
            $scope.select(0);
        }
    });
}

function impactSelect() {
    return {
        templateUrl: 'js/components/filterComponents/impactSelect/impactSelect.html',
        restrict: 'E',
        controller: impactSelectCtrl,
        scope: {}
    };
}

componentsModule.directive('impactSelect', impactSelect);
