'use strict';

var statesModule = require('../../');

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

            $scope.topic = $scope._topic;
            $scope.loading = false;
        }).catch(function (res) {
            if (res.status === 404) {
                return notFound();
            }

            $scope.errored = true;
        });
    }

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
