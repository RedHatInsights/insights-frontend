/*global require*/
'use strict';

const statesModule = require('../');
const reject = require('lodash/reject');
const findIndex = require('lodash/findIndex');

/**
 * @ngInject
 */
function ListRuleCtrl(
        $filter,
        $location,
        $q,
        $rootScope,
        $scope,
        $state,
        Cluster,
        FilterService,
        Group,
        IncidentsService,
        InsightsConfig,
        PermalinkService,
        PreferenceService,
        QuickFilters,
        Rule,
        Utils) {

    FilterService.parseBrowserQueryParams();
    FilterService.setShowFilters(false);
    FilterService.setSearchTerm('');

    Group.init();
    $scope.groups = Group.groups;

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

    $scope.doPage = () => {
        const itemNumber =
              ($scope.pager.currentPage * $scope.pager.perPage) - $scope.pager.perPage;

        $scope.pagedRules = $scope.rules.slice(
            itemNumber,
            itemNumber + $scope.pager.perPage);
    };

    function handleAnchorParam(id) {
        if (id) {
            const idx = findIndex($scope.rules, {rule_id: id});
            $scope.pager.currentPage = Math.floor(idx / $scope.pager.perPage) + 1;
            $scope.doPage();

            // TODO once hash params are fixed elsewhere
            // stop using ?anchor
            $location.search('anchor', null);
            $location.hash(id);
        }
    }

    function handleAgeParam() {
        // because params dont work unless page refresh
        // i.e. a ui-sref({age: 15}) did not work because the filter
        // service already initialized age as 0 from the $location in
        // the original page load
        const age = $location.search().age;
        if (age) {
            FilterService.setAge(age);
        }
    }

    function getData() {
        $scope.loading = true;
        handleAgeParam();

        let promises = [];
        let query = FilterService.buildRequestQueryParams();
        query.include = 'article';

        let ruleSummaryPromise = Rule.getRulesLatest(query)
            .success(function (ruleResult) {
                $scope.rules = reject(ruleResult.resources, function (r) {
                    return (r.rule_id === 'insights_heartbeat|INSIGHTS_HEARTBEAT');
                });

                $scope.pagedRules = $scope.rules.slice(0, $scope.pager.perPage);

                // TODO once hash params are fixed elsewhere
                // stop using ?anchor
                handleAnchorParam($location.search().anchor);

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

        $scope.pager = new Utils.Pager(10);
    }

    $scope.search = function (model) {
        FilterService.setSearchTerm(model);
        FilterService.doFilter();
    };

    $scope.silenceGroup = function (groupId) {
        Rule.silenceGroups([groupId]);
    };

    if (InsightsConfig.authenticate && !PreferenceService.get('loaded')) {
        $rootScope.$on('user:loaded', getData);
    } else {
        getData();
    }
}

statesModule.controller('ListRuleCtrl', ListRuleCtrl);
