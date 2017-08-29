'use strict';

const statesModule = require('../');
const reject = require('lodash/reject');

/**
 * @ngInject
 */
function ListRuleCtrl(
        $filter,
        $q,
        $rootScope,
        $scope,
        $state,
        Cluster,
        FilterService,
        IncidentsService,
        InsightsConfig,
        PermalinkService,
        PreferenceService,
        QuickFilters,
        Rule) {

    FilterService.parseBrowserQueryParams();
    FilterService.setShowFilters(false);
    FilterService.setSearchTerm('');

    $scope.QuickFilters = QuickFilters;

    let params = $state.params;
    $state.transitionTo(
        'app.rules', FilterService.updateParams(params), { notify: false });

    let filters = {
        All: function () {
            $scope.rules = $scope._rules;
        },

        availability: function () {
            $scope.rules = categoryRules('Availability');
        },

        performance: function () {
            $scope.rules = categoryRules('Performance');
        },

        stability: function () {
            $scope.rules = categoryRules('Stability');
        },

        security: function () {
            $scope.rules = categoryRules('Security');
        }
    };

    $scope.canIgnoreRules = true;
    $scope.hideIgnored = false;

    if (typeof InsightsConfig.canIgnoreRules === 'boolean') {
        $scope.canIgnoreRules = InsightsConfig.canIgnoreRules;
    } else if (typeof InsightsConfig.canIgnoreRules === 'function') {
        // set to false while we wait for the callback
        $scope.canIgnoreRules = false;
        InsightsConfig.canIgnoreRules(function (can) {
            $scope.canIgnoreRules = can;
        });
    }

    $scope.setHideIgnored = function (val) {
        $scope.hideIgnored = val;
    };

    let userLoaded = PreferenceService.get('loaded');
    if (userLoaded) {
        $scope.setHideIgnored(PreferenceService.get('hide_ignored_rules'));
    } else {
        $scope.$on('user:loaded', function userLoaded() {
            let hideIgnored = PreferenceService.get('hide_ignored_rules');
            $scope.setHideIgnored(hideIgnored);
        });
    }

    $scope.filter = '';
    $scope.categoryNames =
        ['All', 'availability', 'stability', 'performance', 'security'];
    $scope.tab = 'All';
    $scope.loading = true;
    $scope.errored = false;
    $scope.$watchCollection('_rules', filter);
    $scope.permalink = PermalinkService.make;

    $scope.activateTab = function (tabName) {
        $scope.tab = tabName;
        filter();
    };

    $scope.buttonGroupClass = function (_tab) {
        if ($scope.tab === _tab) {
            return 'btn-default';
        }

        return 'btn-secondary';
    };

    $scope.toggle = function (s) {
        $scope.tab = s;
        filter();
    };

    $scope.filterClass = function (categoryName) {
        if ($scope.tab === categoryName) {
            return 'filter-on';
        }
    };

    $scope.persistHideIgnored = function () {
        PreferenceService.set('hide_ignored_rules', $scope.hideIgnored, true);
    };

    $scope.getClusterImpactedText = function (rule) {
        if (rule.impacted_systems > 0) {
            return 'OpenStack Deployment Impacted';
        } else {
            return 'OpenStack Deployment not Impacted';
        }
    };

    $scope.$on('filterService:doFilter', getData);

    function categoryRules(category) {
        return $filter('filter')($scope._rules, {
            category: category
        });
    }

    function filter() {
        const filterFn = filters[$scope.tab];
        if (filterFn) {
            filterFn();
        }
    }

    function getData() {
        $scope.loading = true;
        let promises = [];
        let query = FilterService.buildRequestQueryParams();
        query.include = 'article';
        let ruleSummaryPromise = Rule.getRulesLatest(query)
            .success(function (ruleResult) {
                $scope._rules = reject(ruleResult.resources, function (r) {
                    return (r.rule_id === 'insights_heartbeat|INSIGHTS_HEARTBEAT');
                });

                PermalinkService.scroll(null, 30);
            })
            .error(function () {
                $scope.errored = true;
            });

        promises.push(ruleSummaryPromise);

        const incidents = IncidentsService.init();

        promises.push(incidents);

        $q.all(promises).then(function listRulesAllPromises() {
            $scope.loading = false;
        });
    }

    $scope.search = function (model) {
        FilterService.setSearchTerm(model);
        FilterService.doFilter();
    };

    if (InsightsConfig.authenticate && !PreferenceService.get('loaded')) {
        $rootScope.$on('user:loaded', getData);
    } else {
        getData();
    }
}

statesModule.controller('ListRuleCtrl', ListRuleCtrl);
