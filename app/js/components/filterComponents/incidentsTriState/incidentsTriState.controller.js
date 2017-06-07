'use strict';

var componentsModule = require('../../');

/**
 * @ngInject
 */
function incidentsTriStateCtrl($location, $rootScope, $scope, Events, IncidentFilters) {

    $scope.incidentFilters = IncidentFilters;

    $scope.filterIncidents = function (key) {
        $scope.showIncidents = key;
        $location.search()[Events.filters.incident] = $scope.showIncidents;

        // If 'All' is selected there is no reason to store the filter
        if ($scope.showIncidents === 'all') {
            delete $location.search()[Events.filters.totalRisk];
        }

        $rootScope.$broadcast(Events.filters.incident);
    };

    $scope.$on(Events.filters.reset, function () {
        $scope.showIncidents = 'all';
    });

    function read () {
        $scope.showIncidents = $location.search()[Events.filters.incident] ?
            $location.search()[Events.filters.incident] : 'all';
    }

    $scope.$on(Events.filters.incident, function () {
        read();
    });

    read();
}

function incidentsTriState() {
    return {
        templateUrl:
            'js/components/filterComponents/incidentsTriState/incidentsTriState.html',
        restrict: 'E',
        controller: incidentsTriStateCtrl
    };
}

componentsModule.directive('incidentsTriState', incidentsTriState);
