'use strict';

var componentsModule = require('../../');

/**
 * @ngInject
 */
function incidentsTriStateCtrl($location,
                               $rootScope,
                               $scope,
                               Events,
                               IncidentFilters,
                               FilterService) {

    $scope.incidentFilters = IncidentFilters;

    $scope.filterIncidents = function (key) {
        $scope.showIncidents = key;
        FilterService.setIncidents(key);
        FilterService.doFilter();

        // If 'All' is selected there is no reason to store the filter
        if ($scope.showIncidents === 'all') {
            $location.search(Events.filters.incident, null);
        } else {
            $location.search(Events.filters.incident, $scope.showIncidents);
        }

        $rootScope.$broadcast(Events.filters.tag, getTag(), Events.filters.incident);
        $rootScope.$broadcast(Events.filters.incident, $scope.showIncidents);
    };

    $scope.$on(Events.filters.reset, function () {
        resetFilter();
    });

    $scope.$on(Events.filters.removeTag, function (event, filter) {
        if (filter === Events.filters.incident) {
            resetFilter();
            $rootScope.$broadcast(filter, 'all');
        }
    });

    function resetFilter () {
        $scope.filterIncidents('all');
        $location.search(Events.filters.incident, null);
    }

    function getTag () {
        let tag = IncidentFilters[$scope.showIncidents].tag;
        if ($scope.showIncidents === 'all') {
            tag = null;
        }

        return tag;
    }

    function init () {
        $scope.showIncidents = $location.search()[Events.filters.incident] ?
            $location.search()[Events.filters.incident] : FilterService.getIncidents();

        $rootScope.$broadcast(Events.filters.tag, getTag(), Events.filters.incident);
    }

    init();
}

function incidentsTriState() {
    return {
        templateUrl:
            'js/components/filterComponents/incidentsTriState/incidentsTriState.html',
        restrict: 'E',
        controller: incidentsTriStateCtrl,
        replace: true
    };
}

componentsModule.directive('incidentsTriState', incidentsTriState);
