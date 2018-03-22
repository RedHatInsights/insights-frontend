/*global require*/
'use strict';

const servicesModule = require('./');

/**
 * @ngInject
 */
function IncidentsService ($q) {
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
        const promise = {
            success: {
            },

            error: {
            }
        };

        return promise;
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
