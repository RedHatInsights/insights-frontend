'use strict';

const componentsModule = require('../../');
const partition = require('lodash/partition');
const _filter = require('lodash/filter');

function topicRuleListCtrl ($filter,
                            $location,
                            $rootScope,
                            $scope,
                            $state,
                            $stateParams,
                            Events,
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
        $scope.showRulesWithNoHits = false;
        $scope.hiddenCount = 0;

        if ($stateParams[Events.filters.totalRisk] &&
            $stateParams[Events.filters.totalRisk] !== 'All') {
            $location.search(Events.filters.totalRisk,
                $stateParams[Events.filters.totalRisk]);
        }

        $scope.filterIncidents = $location.search()[Events.filters.incident];
        $scope.filterIncidents = $scope.filterIncidents ? $scope.filterIncidents : 'all';
        $scope.totalRisk = $location.search()[Events.filters.totalRisk];
        $scope.totalRisk = $scope.totalRisk ? $scope.totalRisk : 'All';
    }

    function updateList (topic) {
        if (!topic) {
            return;
        }

        $scope.filteredRules = applyFilters($scope.topic.rules);
        updateCards($scope.filteredRules);
    }

    $rootScope.$on('account:change', init);
    $scope.$watch('topic', function (topic) {
        $scope.showRulesWithNoHits = (topic && topic.hitCount === 0);
        updateList(topic);
    });

    // Listens for change in incidents filter
    $scope.$on(Events.filters.incident, function () {
        $scope.filterIncidents = $location.search()[Events.filters.incident];
        $scope.filterIncidents = $scope.filterIncidents ? $scope.filterIncidents : 'all';
        updateList($scope.topic);
    });

    // Listens for change in total risk filter
    $scope.$on(Events.filters.totalRisk, function () {
        $scope.totalRisk = $location.search()[Events.filters.totalRisk];
        $scope.totalRisk = $scope.totalRisk ? $scope.totalRisk : 'All';
        updateList($scope.topic);
    });

    // Listens for Reset filters
    $scope.$on(Events.filters.reset, function () {
        $scope.filterIncidents = 'all';
        $scope.totalRisk = 'All';
        updateList($scope.topic);
    });

    function applyFilters (rules) {

        // Filter based on incidents value
        if ($scope.filterIncidents === 'incidents') {
            rules = _filter(rules, (rule) => {
                return IncidentsService.isIncident(rule.rule_id);
            });
        } else if ($scope.filterIncidents === 'nonIncidents') {
            rules = _filter(rules, (rule) => {
                return !IncidentsService.isIncident(rule.rule_id);
            });
        }

        // Filter based on total risk
        if ($scope.totalRisk !== 'All') {
            rules = _filter(rules, (rule) => {
                return rule.severity === $scope.totalRisk;
            });
        }

        return rules;
    }

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

    $scope.checkIncident = function (rule_id) {
        return IncidentsService.isIncident(rule_id);
    };

    function order() {
        $scope.topic.rules = $filter('orderBy')($scope.topic.rules,
            ['_type',
            ($scope.sorter.reverse ?
                '-' + $scope.sorter.predicate :
                $scope.sorter.predicate)]);

        $scope.filteredRules = applyFilters($scope.topic.rules);
        updateCards($scope.filteredRules);
    }

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
