/*global require*/
'use strict';

var componentsModule = require('../../');
const FileSaver = require('file-saver');
const parseHeader = require('parse-http-header');

/**
 * @ngInject
 */
function MaintenancePlaybook($modalInstance,
                             $scope,
                             $timeout,
                             plan,
                             questions,
                             unsupportedRules,
                             AnsibleAPIErrors,
                             AnsibleErrors,
                             AnsibleService,
                             Maintenance,
                             SystemsService,
                             ModalUtils) {

    $scope.RULES_WITHOUT_PLAYS = 0;
    $scope.RESOLVE_QUESTIONS = 1;
    $scope.SUMMARY = 2;
    $scope.MINIMUM_NUMBER_OF_ITEMS = 5;

    /**
     * Initializes the list of questions and resolutions
     * Sets the currentQuestion and rulesWithoutPlays
     */
    function init () {
        $scope.error = null;
        $scope.plan = plan;
        $scope.currentQuestion = null;
        $scope.listLimit = $scope.MINIMUM_NUMBER_OF_ITEMS;

        // make sure system types are loaded before going further
        SystemsService.getSystemTypesAsync().then(function () {
            if (unsupportedRules === null) {
                AnsibleService.init(questions,
                    $scope.plan,
                    false);
                $scope.questions = AnsibleService.questions;
            } else {
                setRulesWithoutPlays();
            }

            initStep();
        });
    }

    $scope.close = function () {
        $modalInstance.dismiss('close');
    };

    /**
     * Save the current question and navigate to the selected step
     */
    $scope.goToStep = function (step) {
        $scope.listLimit = $scope.MINIMUM_NUMBER_OF_ITEMS;

        // save the resolution
        if ($scope.step === $scope.RESOLVE_QUESTIONS &&
            $scope.currentQuestion.resolution_type !== undefined) {
            saveResolution();
        }

        if (step === $scope.questions.length) {
            $scope.step = $scope.SUMMARY;
            $scope.currentQuestion = null;
            setRulesWithPlays();
        } else {
            $scope.step = $scope.RESOLVE_QUESTIONS;
            setCurrentQuestion(step);
        }
    };

    /**
     * Gets the rules that do not have supported playbooks
     */
    function setRulesWithoutPlays () {
        $scope.rulesWithoutPlays = [];

        // build rule objects
        unsupportedRules.forEach((rule) => {
            let fullRule = $scope.plan.rules.find((element) => {
                return element.id === rule.rule_id;
            });

            let ruleWithoutPlay = {
                rule_id: rule.rule_id,

                // this is safe as system types are awaited within init()
                system_type: SystemsService.getSystemTypeUnsafe(rule.system_type_id),
                description: fullRule.description,
                category: fullRule.category,
                severity: fullRule.severity,
                actions: fullRule.actions
            };

            $scope.rulesWithoutPlays.push(ruleWithoutPlay);
        });
    }

    /**
     * Gets the list of rules that are being fixed with this playbook
     */
    function setRulesWithPlays () {

        let rulesWithPlays = {};
        let platformRule = {};
        let excludeRule = false;

        $scope.plan.rules.forEach((rule) => {
            rule.actions.forEach((action) => {

                excludeRule = false;

                // if rule.rule_id and action.system.system_type_id exists in any
                // ruleWithoutPlay, omit the rule
                if ($scope.rulesWithoutPlays !== undefined &&
                    $scope.rulesWithoutPlays.length > 0) {
                    $scope.rulesWithoutPlays.forEach((ruleWithoutPlay) => {

                        if (action.system.system_type_id ===
                            ruleWithoutPlay.system_type.id &&
                            rule.rule_id === ruleWithoutPlay.rule_id) {
                            excludeRule = true;
                        }
                    });
                }

                // if rule has play, add it to rulesWithPlays
                if (!excludeRule) {
                    platformRule = {
                        rule_id: rule.rule_id,
                        category: rule.category,
                        description: rule.description,

                        // this is safe as system types are awaited within init()
                        system_type: SystemsService.getSystemTypeUnsafe(
                            action.system.system_type_id)
                    };

                    platformRule.solution = AnsibleService.getResolution(
                        platformRule.rule_id,
                        platformRule.system_type.id);

                    // solution will be undefined if play was not ambiguous
                    if (platformRule.solution !== undefined) {
                        platformRule.solution = platformRule.solution.description;
                    }

                    // use Hashmap to prevent duplicates
                    rulesWithPlays[
                        platformRule.rule_id + '-' + platformRule.system_type.id] =
                            platformRule;
                }
            });
        });

        $scope.rulesWithPlays = rulesWithPlays;
    }

    /**
     * Initializes the modal state
     *
     * Sets step to RULES_WITHOUT_PLAYS if there are rules that we do not have ansible
     * plays for. Else, set the first questions and show it to the user
     */
    function initStep () {
        if (unsupportedRules !== null) {
            $scope.step = $scope.RULES_WITHOUT_PLAYS;
        } else {
            $scope.step = $scope.RESOLVE_QUESTIONS;
            setCurrentQuestion(0);
        }
    }

    /**
     * This function is enacted when the user select Next on the modal
     *
     * This function does 3 things:
     * - Saves a resolution if currentQuestion is not null
     * - Sets the step to either RESOLVE_QUESTIONS or SUMMARY
     * - Sets currentQuestion to the next question or to null if we are on the last
     *   question
     */
    $scope.nextStep = function () {
        $scope.listLimit = $scope.MINIMUM_NUMBER_OF_ITEMS;
        $scope.error = null;

        // save the resolution
        if ($scope.step === $scope.RESOLVE_QUESTIONS &&
            $scope.currentQuestion.resolution_type !== undefined) {
            saveResolution();
        }

        // determine the next step to go to from here
        if ($scope.step === null) {
            initStep();
        } else {
            $scope.step = $scope.RESOLVE_QUESTIONS;
            setNextQuestion();
            if ($scope.currentQuestion === null) {
                $scope.step = $scope.SUMMARY;
            }
        }
    };

    function saveResolution() {
        let resolution = $scope.currentQuestion.resolutions.find((res) => {
            return res.resolution_type === $scope.currentQuestion.resolution_type;
        });

        AnsibleService.saveResolution(
            $scope.currentQuestion.rule_id,
            $scope.currentQuestion.system_type_id,
            $scope.currentQuestion.resolution_type,
            $scope.currentQuestion.index,
            resolution.description
        );
    }

    /**
     * This function is enacted when the user select Prev on the modal
     *
     * This function does 3 things:
     * - Saves a resolution if currentQuestion is not null
     * - Sets the step to either RESOLVE_QUESTIONS or RULES_WITHOUT_PLAYS
     * - Sets currentQuestion to the previous question or to null if step is set to
     *   RULES_WITHOUT_PLAYS
     */
    $scope.prevStep = function () {
        $scope.listLimit = $scope.MINIMUM_NUMBER_OF_ITEMS;
        $scope.error = null;

        // save the resolution
        if ($scope.step === $scope.RESOLVE_QUESTIONS &&
            $scope.currentQuestion.resolution_type !== undefined) {
            saveResolution();
        }

        // get the next step
        if ($scope.step === $scope.SUMMARY) {
            $scope.step = $scope.RESOLVE_QUESTIONS;
            setCurrentQuestion($scope.questions.length - 1);
        } else if ($scope.currentQuestion.index === 0) {
            $scope.step = $scope.RULES_WITHOUT_PLAYS;
            $scope.currentQuestion = null;
        } else {
            let qIndex = $scope.currentQuestion.index - 1;
            setCurrentQuestion(qIndex);
        }
    };

    /**
     * Sets the current question and possible resolutions
     * Retrieves the systems and system_type that are affected
     * Sets the current rule that is being evaluated
     */
    function setCurrentQuestion (qIndex) {
        let fullRule = $scope.plan.rules.find((element) => {
            return element.id === $scope.questions[qIndex].rule_id;
        });

        $scope.currentQuestion = $scope.questions[qIndex];
        $scope.currentQuestion.index = qIndex;

        $scope.currentQuestion.resolution_type =
            AnsibleService.getResolutionType($scope.currentQuestion);

        // this is safe as system types are awaited within init()
        $scope.currentQuestion.system_type = SystemsService.getSystemTypeUnsafe(
            $scope.currentQuestion.system_type_id);

        // gets systems that match the rule and system type for the current question
        $scope.currentQuestion.systemsAffected = fullRule.actions.filter((action) => {
            return action.system.system_type_id ===
                   $scope.currentQuestion.system_type_id;
        });

        $scope.currentQuestion.rule = {
            rule_id: $scope.currentQuestion.rule_id,
            category: fullRule.category,
            description: fullRule.description
        };
    }

    /**
     * Sets currentQuestion to the next question in the list of questions or null
     * if we reach the end of the array.
     */
    function setNextQuestion () {
        if ($scope.currentQuestion === null) {
            setCurrentQuestion(0);
        } else if ($scope.currentQuestion.index < $scope.questions.length - 1) {
            let qIndex = $scope.currentQuestion.index + 1;
            setCurrentQuestion(qIndex);
        } else {
            $scope.currentQuestion = null;
            setRulesWithPlays();
        }
    }

    /**
     * Check to see if all questions have a resolution
     */
    $scope.validateQuestions = function () {
        return AnsibleService.hasAllQuestionsAnswered();
    };

    /**
     * Posts to maintenance/:id/playbook to create the playbook given the resolutions
     */
    $scope.downloadPlaybook = function () {
        if ($scope.validateQuestions) {
            $scope.generatePlaybook($scope.plan.maintenance_id,
                AnsibleService.getFormattedResolutions());
        } else {
            $scope.error = AnsibleErrors.AnswerAllQuestions;
        }
    };

    /**
     * Posts data to playbook endpoint and handles the result
     */
    $scope.generatePlaybook = function (maintenance_id, args) {
        if (args === null || args === undefined) {
            args = {ignoreUnsupported: true};
        }

        Maintenance.generatePlaybook(
            maintenance_id,
            args
        )
        .then(function generatedPlaybook(response) {
            if (response.status === 200) {
                const disposition = response.headers('content-disposition');
                const filename = parseHeader(disposition).filename.replace(/"/g, '');
                const blob = new Blob([response.data],
                                      {type: response.headers('content-type')});
                FileSaver.saveAs(blob, filename);
                $scope.close();
            }
        },

        function handlePlaybookError (resp) {
            if (resp.status === 400) {
                if (resp.data.error.key === AnsibleAPIErrors.AmbiguousResolution) {
                    questions = resp.data.error.details;
                    unsupportedRules = null;
                    init();
                } else if (
                    resp.data.error.key === AnsibleAPIErrors.MaintenanceNothingToFix ||
                    resp.data.error.key === AnsibleAPIErrors.MaintenanceEmpty) {
                    // should never happen
                    $scope.error = AnsibleErrors.NoActions;
                } else {
                    // Generic failure
                    $scope.error = AnsibleErrors.GeneralFailure;
                }
            }
        });
    };

    init();
    ModalUtils.suppressEscNavigation($modalInstance);
}

componentsModule.controller('MaintenancePlaybook', MaintenancePlaybook);
