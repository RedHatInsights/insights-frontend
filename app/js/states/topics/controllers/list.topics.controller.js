'use strict';

const statesModule = require('../../');
const get = require('lodash/get');

/**
 * @ngInject
 */
function TopicRuleListCtrl(
        $scope,
        $state,
        $rootScope,
        $stateParams,
        Topic,
        FilterService,
        DataUtils,
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
        let product;
        if (FilterService.getSelectedProduct() !== 'all') {
            product = FilterService.getSelectedProduct();
        }

        Topic.get($stateParams.id, product).success(function (topic) {
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
            $scope.loading = false;
        }).catch(function (res) {
            if (res.status === 404) {
                return notFound();
            }

            $scope.errored = true;
        });
    }

    $scope.search = {
        filters: ['description']
        .map(prop => function (rule, query) {
            return String(get(rule, prop)).includes(query);
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
