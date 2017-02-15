'use strict';

var servicesModule = require('./');
const pluck = require('lodash/collection/pluck');

/**
 * @ngInject
 */
function AnsibleService(SystemsService) {

    var ansibleService = {};
    var plan = null;

    ansibleService.questions = [];

    ansibleService.resolutions = {};

    /**
     * Initializes the state of AnsibleService if the maintenance_id is unique
     *   (hasn't already been initialized) or if the user wants to force init
     */
    ansibleService.init = function (ambiguousResolutions, maintenancePlan, force) {
        if (plan === null ||
            maintenancePlan.maintenance_id !== plan.maintenance_id ||
            force === true) {
            plan = maintenancePlan;
            ansibleService.resolutions = {};
            ansibleService.questions = [];

            ambiguousResolutions.forEach((resolution) => {
                resolution.hasAnswer = false;
                ansibleService.questions.push(resolution);
            });
        }
    };

    /**
     * adds a user's answer to the resolution set
     */
    ansibleService.saveResolution = function (
        ruleId,
        systemTypeId,
        resolution,
        qIndex,
        description) {

        ansibleService.resolutions[ruleId + '-' + systemTypeId] =
            {
                rule_id: ruleId,
                system_type_id: systemTypeId,
                resolution_type: resolution,
                description: description
            };

        ansibleService.questions[qIndex].hasAnswer = true;
    };

    /**
     * Check to see if all questions have been answered
     */
    ansibleService.hasAllQuestionsAnswered = function () {
        return ansibleService.questions.length ===
            Object.keys(ansibleService.resolutions).length;
    };

    /**
     * Returns the resolution type for the given question.
     * If one does not exist, return the first option of the questions
     * resolution options by default
     *
     * @return {String} resolution type for the given question
     */
    ansibleService.getResolutionType = function (question) {
        let resolution = ansibleService.getResolution(
            question.rule_id,
            question.system_type_id);

        if (resolution === undefined) {
            // set resolution_type to equal first option by default
            resolution = question.resolutions[0];
        }

        resolution = resolution.resolution_type;

        return resolution;
    };

    ansibleService.getResolution = function (rule_id, system_type_id) {
        return ansibleService.resolutions[rule_id + '-' + system_type_id];
    };

    /**
     * Formats the resolutions to fit the api's desired structure
     */
    ansibleService.getFormattedResolutions = function () {
        let formattedResolutions = {ignoreUnsupported: true, resolutions: []};
        let key;
        let resolution;
        for (key in ansibleService.resolutions) {
            resolution = ansibleService.resolutions[key];

            formattedResolutions.resolutions.push({
                rule_id: resolution.rule_id,
                system_type_id: resolution.system_type_id,
                resolution_type: resolution.resolution_type
            });
        }

        return formattedResolutions;
    };

    /**
     * Gathers all systems that have actions that will be resolved by the generated
     * playbook and organizes them by their system_type
     */
    ansibleService.getSystemSummary = function () {
        let systemSummary = {};

        // gets the list of rules that have an ansible_resolution for this plan
        let ruleList = plan.rules.filter((rule) => {
            return pluck(ansibleService.questions, 'rule_id')
                   .includes(rule.rule_id);
        });

        // Creates a hashmap of {product_code: {system_type<Object>, systems<Array>}}:
        // 1) Gets each system from the actions of the rules in ruleList
        // 2) Creates a new hask key using the system_type.product_code if doesn't exist
        // 3) Adds the system_type object to the object of this hash
        // 4) Adds the system object to the object of this hash
        ruleList.forEach((rule) => {
            let systemType = null;
            rule.actions.forEach((action) => {
                systemType = SystemsService.getSystemType(action.system.system_type_id);
                if (systemType.product_code in systemSummary) {
                    systemSummary[systemType.product_code].systems.push(action.system);
                } else {
                    systemSummary[systemType.product_code] = {
                        system_type: systemType,
                        systems: [action.system]
                    };
                }
            });
        });

        return systemSummary;
    };

    return ansibleService;
}

servicesModule.service('AnsibleService', AnsibleService);
