/*global require*/
'use strict';

var servicesModule = require('./');
const clone = require('lodash/clone');
const some = require('lodash/some');

function DataUtils(Utils, Severities) {
    var service = {};

    service.readArray = function (fn) {
        return function (array) {
            return array.map(function (element) {
                return fn(element);
            });
        };
    };

    /*
     * True if either the end date is in the future or it is in the past
     * but there are actions that has not been finished yet.
     */
    function isPending(plan) {
        if (plan.overdue) {
            return true;
        }

        if (new Date(plan.end) > new Date()) {
            return true;
        }

        return false;
    }

    function countDone(object) {
        if ('actions' in object) {
            object.actionsDone = object.actions.filter(function (action) {
                return action.done;
            }).length;
        }
    }

    function readDate (date) {
        var parsed;
        if (date) {
            parsed = new Date(date);
            if (parsed.getTime()) { // temp. workaround for an API glitch
                return parsed;
            }
        }

        return null;
    }

    service.readPlan = function (plan) {
        plan.actions = plan.actions.filter(function (action) {
            return action.system !== null && action.rule !== null;
        });

        plan.actions.forEach(function (action) {
            action.system = service.readSystem(action.system);
            action.rule.rule_id = action.rule.id;
            service.readRule(action.rule);
        });

        plan.rules = Utils.groupByObject(plan.actions, 'rule.id', 'rule', 'actions')
            .map(clone);
        plan.systems = Utils.groupByObject(
            plan.actions, 'system.system_id', 'system', 'actions');

        countDone(plan);
        plan.systems.forEach(countDone);
        plan.rules.forEach(countDone);
        plan.rules.forEach(function (rule) {
            rule.ansible = some(rule.actions, 'rule.ansible');
        });

        plan.start = readDate(plan.start);
        plan.end = readDate(plan.end);
        if (!plan.end) {
            plan.overdue = false; // temp. workaround for an API glitch
        }

        plan.pending = isPending(plan);

        if (plan.description) {
            plan.description = plan.description.trim();
        }

        plan.isReadOnly = function () {
            return plan.suggestion === 'proposed';
        };

        return plan;
    };

    service.readSystem = function (system) {
        system._name = (system.display_name || system.hostname);
        return system;
    };

    service.readReport = function (report) {
        report.system = service.readSystem(report.system);
    };

    service.readRule = function (rule) {
        rule.severityNum = Severities.map(function (severity) {
            return severity.value;
        }).indexOf(rule.severity);
    };

    function getRuleState (rule) {
        if (rule.active) {
            return 'active';
        } else if (rule.needs_content) {
            return 'needs-content';
        } else if (rule.retired) {
            return 'retired';
        } else {
            return 'inactive';
        }
    }

    service.readRuleState = function (rule) {
        rule.state = getRuleState(rule);
    };

    return service;
}

servicesModule.service('DataUtils', DataUtils);
