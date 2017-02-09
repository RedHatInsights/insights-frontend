'use strict';

var statesModule = require('../../');

/**
 * @ngInject
 */
function ShowRuleCtrl($scope, $state, $stateParams, Rule, RulePreview, TitleService) {
    Rule.byId($stateParams.id, true).success(function (rule) {
        $scope.rule = rule;
        if (rule && rule.rule_id) {
            TitleService.set(rule.rule_id);
        }
    });

    $scope.preview = RulePreview.preview;
    $scope.editInfo = function (info) {
        $state.go('app.edit-rule', {
            id: info.rule_id
        });
    };
}

statesModule.controller('ShowRuleCtrl', ShowRuleCtrl);
