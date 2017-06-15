'use strict';

var servicesModule = require('./');

/**
 * @ngInject
 */
function IncidentsService ($q, Topic) {
    let service = {};
    let incidentRules = [];

    /**
     * Populates incidentRules and returns a promise
     */
    service.init = function () {
        if (incidentRules.length === 0) {
            return service.loadIncidents();
        }
        else {
            return $q.resolve(true);
        }
    };

    /**
     * Allows user to force reload incidentRules
     */
    service.loadIncidents = function () {
        return Topic.get('incidents').success(function (topic) {
            incidentRules = topic.rules;
        });
    };

    /**
     * Determines if rule of given ruleId is an incident
     */
    service.isIncident = function (ruleId) {
        let isIncident = incidentRules.find((incident) => {
            return incident.rule_id === ruleId;
        });

        return isIncident !== undefined;
    };

    return service;
}

servicesModule.factory('IncidentsService', IncidentsService);
