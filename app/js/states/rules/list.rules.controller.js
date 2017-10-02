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

    $scope.loading = true;
    $scope.errored = false;
    $scope.permalink = PermalinkService.make;

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
    $scope.$on('reload:data', getData);

    function getData() {
        $scope.loading = true;
        let promises = [];
        let query = FilterService.buildRequestQueryParams();
        query.include = 'article';
        let ruleSummaryPromise = Rule.getRulesLatest(query)
            .success(function (ruleResult) {
                $scope.rules = reject(ruleResult.resources, function (r) {
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
