'use strict';

var servicesModule = require('./');

/**
 * @ngInject
 */
function AnsibleService(Playbooks) {

    var yamlFile = Playbooks.NoRuleSelected.playbook;
    var yamlFileVariables = Playbooks.NoRuleSelected.playbook_variables;
    var filename = Playbooks.NoRuleSelected.filename;

    var ansibleService = {};

    ansibleService.questions = [];

    ansibleService.answers = {};

    ansibleService.initAnswers = function () {
        ansibleService.answers = {};
    };

    /**
     * adds a user's answer to the answer set. The question key should correspond
     * to the variable that is being replaced in the ansible playbook
     */
    ansibleService.saveAnswer = function (questionName, question, answer) {
        ansibleService.answers[questionName] = {
            question: question,
            answer: answer
        };
    };

    /**
     * substitutes variable placeholders with answers from the answers set
     */
    function buildYamlFile (systems) {
        var answer;
        var variable;
        var yamlToReturn = setHosts(systems, yamlFile);
        for (answer in ansibleService.answers) {
            if (ansibleService.answers.hasOwnProperty(answer)) {

                // replace !-ed variables with false unless the user selected false
                // in which case we will replace it with true
                yamlToReturn = yamlToReturn.replace('{{!' + answer + '}}',
                    (ansibleService.answers[answer].answer.toLowerCase() === 'false'));

                // replace all other variables
                yamlToReturn = yamlToReturn.replace('{{' + answer + '}}',
                    ansibleService.answers[answer].answer);
            }
        }

        for (variable in yamlFileVariables) {
            if (yamlFileVariables.hasOwnProperty(variable)) {

                // replace !-ed variables with false unless the user selected false
                // in which case we will replace it with true
                yamlToReturn = yamlToReturn.replace('{{!' + variable + '}}',
                    JSON.stringify(!yamlFileVariables[variable]));

                // replace all other variables
                yamlToReturn = yamlToReturn.replace('{{' + variable + '}}',
                    JSON.stringify(yamlFileVariables[variable]));
            }
        }

        return yamlToReturn;
    }

    /**
     * replaces {{hosts}} variable in yaml file with the systems selected
     */
    function setHosts (systems, playbook) {
        var selectedSystems = [];
        systems.forEach(function (value) {
            selectedSystems.push(value.hostname);
        });

        return playbook.replace('{{hosts}}', '[' + selectedSystems.toString() + ']');
    }

    /**
     * downloads the playbook
     */
    ansibleService.downloadPlaybook = function (systems) {
        var element = document.createElement('a');
        var href = 'data:' + 'text/plain;charset=utf-8,';
        var event = new MouseEvent('click', {
            canBubble: true,
            cancelable: true,
            view: window
        });
        var playbook = buildYamlFile(systems);
        href +=  encodeURIComponent(playbook);

        element.setAttribute('href', href);
        element.setAttribute('download', filename);
        element.dispatchEvent(event);
    };

    ansibleService.checkPlaybook = function (rule_id) {
        return rule_id in Playbooks;
    };

    /**
     * sets the playbook to use from the playbooks constants
     */
    ansibleService.setPlaybook = function (rule_id) {
        var playbook_index = rule_id;

        if (!playbook_index) {
            playbook_index = 'NoRuleInScope';
        }

        if (!(playbook_index in Playbooks)) {
            playbook_index = 'NoPlaybookForRule';
        }

        yamlFile = Playbooks[playbook_index].playbook;
        yamlFileVariables = Playbooks[playbook_index].playbook_variables;
        filename = Playbooks[playbook_index].filename;

        ansibleService.questions = Playbooks[playbook_index].questions;
        ansibleService.initAnswers();
    };

    return ansibleService;
}

servicesModule.service('AnsibleService', AnsibleService);
