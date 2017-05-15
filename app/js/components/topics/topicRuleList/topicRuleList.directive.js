'use strict';

var componentsModule = require('../../');
var partition = require('lodash/partition');

function topicRuleListCtrl ($filter,
                            $rootScope,
                            $scope,
                            $state,
                            IncidentsService,
                            InsightsConfig,
                            ListTypeService,
                            RuleService,
                            Utils) {

    $scope.config = InsightsConfig;
    $scope.listTypes = ListTypeService.types();
    $scope.getListType = ListTypeService.getType;
    $scope.sorter = new Utils.Sorter({
        predicate:['acked', 'hitCount === 0', '-severityNum', '-hitCount'],
        reverse: false},
        order);

    $scope.filterZero = function filterZero(rule) {
        if ($scope.showRulesWithNoHits || (rule.hitCount > 0 && !rule.acked)) {
            return true;
        }

        return false;
    };

    function init() {
        $scope.loading = true;
        $scope.showRulesWithNoHits = false;
        $scope.hiddenCount = 0;
        IncidentsService.init()
        .then(function () {
            $scope.loading = false;
        });
    }

    function updateList (topic) {
        if (!topic) {
            return;
        }

        updateCards(topic.rules);
    }

    $rootScope.$on('account:change', init);
    $scope.$watch('topic', function (topic) {
        $scope.showRulesWithNoHits = (topic && topic.hitCount === 0);
        updateList(topic);
    });

    function updateCards (rules) {
        if (!$scope.showRulesWithNoHits) {
            const parts = partition(rules, rule => rule.hitCount && !rule.acked);
            $scope.plugins = RuleService.groupRulesByPlugin(parts[0]);
            $scope.hiddenCount = parts[1].length;
        } else {
            $scope.plugins = RuleService.groupRulesByPlugin(rules);
        }
    }

    // show even rules with no hits
    $scope.showAll = function () {
        $scope.showRulesWithNoHits = true;
        updateList($scope.topic);
    };

    $scope.viewImpactedSystems = function (category, ruleId) {
        $state.go('app.actions-rule', {category: category, rule: ruleId});
    };

    function order() {
        $scope.topic.rules = $filter('orderBy')($scope.topic.rules,
            ['_type',
            ($scope.sorter.reverse ?
                '-' + $scope.sorter.predicate :
                $scope.sorter.predicate)]);

        updateCards($scope.topic.rules);
    }

    $scope.isIncident = function (rule) {
        return IncidentsService.isIncident(rule);
    };

    init();
}

/**
 * @ngInject
 */
function topicRuleList () {
    return {
        templateUrl: 'js/components/topics/topicRuleList/topicRuleList.html',
        restrict: 'E',
        replace: true,
        controller: topicRuleListCtrl,
        scope: {
            topic: '='
        }
    };
}

componentsModule.directive('topicRuleList', topicRuleList);
