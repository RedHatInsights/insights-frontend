/*global require*/
'use strict';

var componentsModule = require('../');

/**
 * @ngInject
 */
function PlaybookModalCtrl($modalInstance,
                           $scope,
                           $timeout,
                           system,
                           rule,
                           systems,
                           AnsibleService,
                           Rule,
                           Utils,
                           System,
                           InsightsConfig) {

    function getAnswersSize () {
        return Object.keys($scope.answers).length;
    }

    /**
     * saves the answer and then returns the next question
     * if we are at the end of the map, returns null
     */
    $scope.saveAnswer = function (questionName, question, answer) {
        $scope.loadingQuestion = true;
        AnsibleService.saveAnswer(questionName, question, answer);
        $scope.answers = AnsibleService.answers;
        $scope.answersSize = getAnswersSize();
        $scope.nextStep();
        $scope.loadingQuestion = false;
    };

    /**
    * iterates over the question map and returns the first unanswered question
    */
    function getUnansweredQuestion () {
        var currentQuestion = null;
        var qIndex = null;
        $scope.loadingQuestion = true;
        $scope.questions.some(function (question, index) {
            if (!(question.name in $scope.answers)) {
                currentQuestion = question;
                qIndex = index;
                return true;
            }
        });

        $scope.loadingQuestion = false;
        $scope.setCurrentQuestion(currentQuestion, qIndex);
    }

    $scope.setCurrentQuestion = function (question, index) {
        $scope.currentQuestion = question;
        if (question !== null) {
            $scope.currentQuestion.isAnswered = (question.name in $scope.answers);
            $scope.currentQuestion.index = index;
        }
    };

    $scope.downloadPlaybook = function () {
        AnsibleService.downloadPlaybook($scope.systems);
    };

    $scope.hasPlaybook = function (rule_id) {
        return AnsibleService.checkPlaybook(rule_id);
    };

    $scope.close = function () {
        $modalInstance.dismiss('close');
    };

    $scope.getSystemDisplayName = function (system) {
        return Utils.getSystemDisplayName(system);
    };

    $scope.removeSystem = function (systemIndex) {
        if (systemIndex > -1 && systemIndex < $scope.systems.length) {
            if ($scope.systems.length === 1) {
                systems = [];
                $scope.close();
            }

            $scope.systems.splice(systemIndex, 1);
            systems.splice(systemIndex, 1);
        }
    };

    $scope.nextStep = function () {
        var currentQuestion = null;
        var index = -1;
        if ($scope.currentQuestion !== null &&
            $scope.questions[$scope.currentQuestion.index + 1] !== undefined) {
            currentQuestion = $scope.questions[$scope.currentQuestion.index + 1];
            index = $scope.currentQuestion.index + 1;
        }

        $scope.setCurrentQuestion(currentQuestion, index);
    };

    $scope.prevStep = function () {
        var currentQuestion = null;
        var index = -1;
        if ($scope.questions.length > 0) {
            if ($scope.currentQuestion === null) {
                index = $scope.questions.length - 1;
                currentQuestion = $scope.questions[index];
            }
            else if ($scope.currentQuestion.index > 0) {
                index = $scope.currentQuestion.index - 1;
                currentQuestion = $scope.questions[index];
            }
        }

        $scope.setCurrentQuestion(currentQuestion, index);
    };

    $scope.refreshSettings = function () {
        $scope.refresh = true;
        AnsibleService.initAnswers();
        $scope.answers = AnsibleService.answers;

        $timeout(function () {
            $scope.close();
        }, 3000);
    };

    $scope.setSystemListActive = function (isActive) {
        $scope.systemListActive = isActive;
    };

    $scope.changeRule = function () {
        $scope.loadingQuestion = true;
        $scope.loadingRule = true;

        AnsibleService.setPlaybook($scope.selected.rule.rule_id);

        $scope.questions = AnsibleService.questions;
        $scope.answers = AnsibleService.answers;
        $scope.answersSize = getAnswersSize();
        $scope.currentQuestion = null;
        $scope.refresh = false;
        $scope.rule = null;
        Rule.byId($scope.selected.rule.rule_id).success(function (rule) {
            $scope.rule = rule;
            $scope.loadingRule = false;
        }).error(function () {
            $scope.rule = null;
            $scope.loadingRule = false;
        });

        getUnansweredQuestion();
    };

    $scope.getAvailableRules = function () {
        return $scope.available_rules;
    };

    $scope.loadingReports = true;
    $scope.selected = {};

    if (rule) {
        $scope.selected.rule = rule;
        $scope.changeRule();
        $scope.loadingReports = false;

    } else if (system) {
        System.getSystemReports(system.system_id)
            .success(function (systemWithReports) {
                angular.extend(system, systemWithReports);
                $scope.available_rules = system.reports
                    .map(function (report) {
                        return report.rule;
                    })
                    .filter(function (rule) {
                        return $scope.hasPlaybook(rule.rule_id);
                    });

                $scope.loadingReports = false;
            })
            .error(function (data, status, headers, config) {
                if (InsightsConfig.getReportsErrorCallback) {
                    $scope.loadingReportsErrorMessage =
                        InsightsConfig.getReportsErrorCallback(
                            data,
                            status,
                            headers,
                            config);
                } else {
                    $scope.loadingReportsErrorMessage =
                        '<p>Could Not get System Reports</p>';
                }

                $scope.loadingReports = false;
            });

    } else {
        $scope.loadingReportsErrorMessage = '<p>Nether system nor rule_id</p>';
        $scope.selected.rule = null;
        $scope.changeRule();
        $scope.loadingReports = false;
    }

    $scope.systemListActive = false;
    $scope.systems = systems;

}

componentsModule.controller('PlaybookModalCtrl', PlaybookModalCtrl);
