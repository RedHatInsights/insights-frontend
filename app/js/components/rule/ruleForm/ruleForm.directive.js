'use strict';

var componentsModule = require('../../');

/**
 * @ngInject
 */
function ruleFormCtrl(
    $scope,
    Categories,
    Severities,
    RulePreview,
    User,
    PermissionService,
    Rule,
    $stateParams) {

    $scope.newRule = $stateParams.newRule;
    $scope.locked = true;
    $scope.severities = Severities.filter(function (s) {
        return (s !== 'All');
    });

    $scope.categories = Categories;
    $scope.preview = RulePreview.preview;

    $scope.types = ['rhel', 'osp', 'rhev', 'containers'];

    $scope.toggleLock = function () {
        $scope.locked = !$scope.locked;
    };

    function updateRuleID() {
        if (!$scope.rule) {
            return;
        }

        $scope.rule.rule_id =
            (($scope.rule.plugin || '') + '|' + ($scope.rule.error_key || ''));
    }

    $scope.$watch('rule.plugin', updateRuleID);
    $scope.$watch('rule.error_key', updateRuleID);

    $scope.canEdit = true;

    function canEdit(user) {
        $scope.canEdit =
            (PermissionService.has(user, PermissionService.PERMS.CONTENT_MANAGER));
    }

    User.asyncCurrent(canEdit);

    $scope.availableTags = [];
    Rule.getAvailableTags().then(function (response) {
        $scope.availableTags = response.data;
    });

    $scope.suggestTag = function (query) {
        return $scope.availableTags.filter(function (tag) {
            return tag.name.indexOf(query) !== -1;
        });
    };
}

function ruleForm() {
    return {
        templateUrl: 'js/components/rule/ruleForm/ruleForm.html',
        restrict: 'E',
        controller: ruleFormCtrl
    };
}

componentsModule.directive('ruleForm', ruleForm);
