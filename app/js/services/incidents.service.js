'use strict';

var servicesModule = require('./');

/**
 * @ngInject
 */
function IncidentsService ($q, Topic) {
    var service = {};
    var incidentRules = [];

    service.init = function () {
        if (incidentRules.length === 0) {
            return service.loadIncidents();
        }
        else {
            return $q.resolve(true);
        }
    };

    service.loadIncidents = function () {
        return Topic.get('incidents').success(function (topic) {
            incidentRules = topic.rules;
        });
    };

    service.isIncident = function (ruleId) {
        let isIncident = incidentRules.find((incident) => {
            return incident.rule_id === ruleId;
        });

        return isIncident !== undefined;
    };

    return service;
}

servicesModule.factory('IncidentsService', IncidentsService);
