'use strict';

var servicesModule = require('./');

/**
 * @ngInject
 */
function IncidentsService ($q, Topic) {
    let service = {};
    let incidentRules = [];

    service.incidentRulesWithHitsCount = 0;
    service.affectedSystemCount = 0;

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
            setRulesWithHitsCount(topic.rules);
            service.affectedSystemCount = topic.affectedSystemCount;
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

    function setRulesWithHitsCount (rules) {
        let rulesWithHits = 0;

        rules.forEach((rule) => {
            if (rule.hitCount > 0 && !rule.acked) {
                rulesWithHits++;
            }
        });

        service.incidentRulesWithHitsCount = rulesWithHits;
    }

    return service;
}

servicesModule.factory('IncidentsService', IncidentsService);
