/*global require*/
'use strict';

const componentsModule = require('../../');

function IncidentLiteController ($q, $scope, IncidentsService, Stats) {

    function loadData () {
        let promises = [];

        $scope.loading = true;

        promises.push(loadIncidentNumbers());
        promises.push(loadStats());

        $q.all(promises).finally(() => {
            $scope.loading = false;
        });
    }

    // loads the total number of rule hits that are incidents
    function loadIncidentNumbers () {
        return IncidentsService.loadIncidents().then(() => {
            $scope.incidentCount = IncidentsService.incidentRulesWithHitsCount;
        });
    }

    // loads the total number of rules that have hits
    function loadStats () {
        return Stats.getRules({include: 'ansible'}).then(function (res) {
            $scope.totalHits = res.data.total;
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
