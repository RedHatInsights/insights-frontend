'use strict';

var componentsModule = require('../../');

/**
 * @ngInject
 */
function incidentsTriStateCtrl($location, $rootScope, $scope, Events) {
    $scope.filterIncidents = function () {
        $location.search().filterIncidents = $scope.showIncidents;
        $rootScope.$broadcast(Events.topicFilters.incident);
    };

    $scope.$on(Events.topicFilters.reset, function () {
        $scope.showIncidents = 'all';
    });

    function init () {
        $scope.showIncidents = $location.search().filterIncidents ?
            $location.search().filterIncidents : 'all';
    }

    init();
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
