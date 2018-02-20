'use strict';

const statesModule = require('../../');
const get = require('lodash/get');

/**
 * @ngInject
 */
function TopicRuleListCtrl(
        $q,
        $rootScope,
        $scope,
        $state,
        $stateParams,
        Topic,
        FilterService,
        DataUtils,
        IncidentsService,
        QuickFilters,
        PermalinkService,
        ActionsBreadcrumbs,
        InsightsConfig,
        ActionbarService,
        Export) {

    FilterService.parseBrowserQueryParams();
    FilterService.setShowFilters(false);

    $scope.loading = true;
    $scope.QuickFilters = QuickFilters;

    function notFound() {
        $state.go('app.actions');
    }

    function getData() {
        let promises = [];

        // preload incidents topic to prevent multiple calls from incidentIcon
        const initIncidents = IncidentsService.init();

        promises.push(initIncidents);

        const initTopic = Topic.get($stateParams.id, 'resolution_risk')
        .success(function (topic) {
            if (topic.hidden && !$scope.isInternal) {
                return notFound();
            }

            $scope._topic = topic;
            topic.rules.forEach(DataUtils.readRule);

            ActionsBreadcrumbs.init($stateParams);
            ActionsBreadcrumbs.add({
                label: topic.title,
                state: 'app.topic',
                params: {
                    id: $stateParams.id
                }
            });

            PermalinkService.scroll(null, 30);

            $scope.topic = Object.create($scope._topic);
        }).catch(function (res) {
            if (res.status === 404) {
                return notFound();
            }

            $scope.errored = true;
        });

        promises.push(initTopic);

        $q.all(promises).finally(function promisesFinally() {
            $scope.loading = false;
        });
    }

    $scope.search = {
        filters: ['description']
        .map(prop => function (rule, query) {
            return String(get(rule, prop)).toUpperCase().includes(query.toUpperCase());
        }),

        doFilter: function (query) {
            $scope.loading = true;

            // refreshes topic and components that reference topic
            $scope.topic = undefined;
            $scope.topic = Object.create($scope._topic);

            if (query) {
                $scope.topic.rules = $scope._topic.rules.filter(function (system) {
                    return $scope.search.filters.some(f => f(system, query));
                });
            } else {
                $scope.topic.rules = $scope._topic.rules;
            }

            $scope.loading = false;
        }
    };

    $rootScope.$on('reload:data', getData);
    $scope.$on('group:change', getData);
    getData();

    if (InsightsConfig.allowExport) {
        ActionbarService.addExportAction(function () {
            Export.getReports($stateParams.id);
        });
    }
}

statesModule.controller('TopicRuleListCtrl', TopicRuleListCtrl);
