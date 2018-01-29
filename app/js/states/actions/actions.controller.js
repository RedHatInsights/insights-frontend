'use strict';

const statesModule = require('../');

/**
 * @ngInject
 */
function ActionsCtrl(
    $q,
    $rootScope,
    $scope,
    $stateParams,
    $state,
    ActionbarService,
    ActionsBreadcrumbs,
    Categories,
    Export,
    FilterService,
    IncidentsService,
    InsightsConfig,
    PreferenceService,
    QuickFilters,
    Stats,
    System,
    SystemsService,
    Topic,
    TopicService) {

    const params = $state.params;
    $scope.loading = true;
    $scope.stats = {};
    $scope.show = {
        extraTopics: false
    };

    FilterService.parseBrowserQueryParams();
    FilterService.setShowFilters(false);
    FilterService.setSearchTerm('');

    $state.transitionTo(
        'app.actions', FilterService.updateParams(params), { notify: false });

    $scope.QuickFilters = QuickFilters;

    $scope.getSelectedProduct = FilterService.getSelectedProduct;

    $scope.openMenu = function ($mdMenu, ev) {
        $mdMenu.open(ev);
    };

    let reload = function () {
        const promises = [];

        $scope.loading = true;

        promises.push(TopicService.reload(FilterService.getSelectedProduct()).then(() => {
            const topics = TopicService.topics.filter(topic => {
                return topic.ruleBinding !== 'implicit';
            });

            $scope.featuredTopics = topics.slice(0, 3);
            $scope.extraTopics = topics.slice(3);

            let product;
            if (FilterService.getSelectedProduct() !== 'all') {
                product = FilterService.getSelectedProduct();
            }
        }));

        promises.push(loadStats());

        promises.push(IncidentsService.init().then(() => {
            $scope.incidentCount = IncidentsService.incidentRulesWithHitsCount;
            $scope.incidentSystemCount = IncidentsService.affectedSystemCount;
        }));

        $q.all(promises).finally(() => $scope.loading = false);
    };

    const listeners = [
        $scope.$on('filterService:doFilter', reload),
        $scope.$on('group:change', reload),
        $rootScope.$on('$stateChangeStart', function () {
            listeners.forEach(listener => listener());
        })
    ];

    ActionsBreadcrumbs.init($stateParams);

    const getData = function () {
        System.getProductSpecificData();
        reload();
    };

    if (InsightsConfig.authenticate && !PreferenceService.get('loaded')) {
        $rootScope.$on('user:loaded', getData);
    } else {
        getData();
    }

    function loadStats () {
        let product = FilterService.getSelectedProduct();
        let promises = [];
        if (product === 'all') {
            product = undefined;
        }

        promises.push(Stats.getRules({
            product: product
        }).then(function (res) {
            $scope.stats.rules = res.data;
            setCategoryTopics(res.data);
        }));

        return $q.all(promises);
    }

    /**
     * adds non-empty categories  to $scope.categoryTopics
     */
    function setCategoryTopics(rules) {
        let categoryCount;
        $scope.categoryTopics = [];

        Categories.forEach((category) => {
            categoryCount = rules[category];
            if (categoryCount !== undefined && categoryCount > 0 && category !== 'all') {
                $scope.categoryTopics.push({
                    id:    category,
                    count: categoryCount
                });
            }
        });
    }

    if (InsightsConfig.allowExport) {
        ActionbarService.addExportAction(function () {
            Export.getReports();
        });
    }
}

statesModule.controller('ActionsCtrl', ActionsCtrl);
