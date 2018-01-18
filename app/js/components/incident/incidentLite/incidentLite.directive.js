/*global require*/
'use strict';

const componentsModule = require('../../');

function IncidentLiteController ($q, $scope, IncidentsService) {

    function loadData () {
        $scope.loading = true;

        loadIncidentNumbers().finally(() => $scope.loading = false);
    }

    // loads the total number of rule hits that are incidents
    function loadIncidentNumbers () {
        return IncidentsService.loadIncidents().then(() => {
            $scope.incidentCount = IncidentsService.incidentRulesWithHitsCount;
        });
    }

    loadData();

    // reload data when system group changes
    $scope.$on('group:change', function () {
        loadData();
    });
}

function incidentLite() {
    return {
        controller: IncidentLiteController,
        templateUrl: 'js/components/incident/incidentLite/incidentLite.html',
        restrict: 'E',
        replace: false
    };
}

componentsModule.directive('incidentLite', incidentLite);
