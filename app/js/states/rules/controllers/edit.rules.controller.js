'use strict';

var statesModule = require('../../');

/**
 * @ngInject
 */
function EditRuleCtrl(
    $scope,
    $stateParams,
    $state,
    Rule,
    Plugin,
    TitleService,
    $q,
    StrataService) {

    Rule.byId($stateParams.id, true).success(function (rule) {
        $scope.rule = rule;

        // Keep a reference of original rule_id
        $scope.rule._rule_id = rule.rule_id;
        if (rule && rule.rule_id) {
            TitleService.set(rule.rule_id);
        }
    });

    $scope.saveFn = function () {
        let q = $q.when();

        if ($scope.rule.node_id && $scope.rule.node_id.indexOf('http') > -1) {
            q = q.then(function () {
                return StrataService.searchByUri($scope.rule.node_id).then(function (r) {
                    if (!r.length) {
                        // we use field validator thus this should never happen
                        throw new Error ('no results');
                    }

                    $scope.rule.node_id = r[0].display_id;
                });
            });
        }

        q.then(function () {
            const rule = Rule.update($scope.rule);
            const plugin = Plugin.update($scope.rule.plugin, {
                name: $scope.rule.plugin_name
            });

            $q.all([rule, plugin]).then(function (responses) {
                $state.go('app.show-rule', {
                    id: responses[0].data.rule_id
                });
            });
        });
    };
}

statesModule.controller('EditRuleCtrl', EditRuleCtrl);
