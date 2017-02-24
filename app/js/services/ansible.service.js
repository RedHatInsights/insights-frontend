'use strict';

var servicesModule = require('./');

/**
 * @ngInject
 */
function AnsibleService() {

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

    return ansibleService;
}

servicesModule.service('AnsibleService', AnsibleService);
