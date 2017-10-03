'use strict';

const componentsModule = require('../../');

function incidentSummary() {
    return {
        templateUrl: 'js/components/incident/incidentSummary/incidentSummary.html',
        restrict: 'E',
        scope: {
            incidentCount: '<',
            incidentSystemCount: '<',
            ruleHits: '<'
        }
    };
}

componentsModule.directive('incidentSummary', incidentSummary);
