'use strict';

const statesModule = require('../');

/**
 * @ngInject
 */
function ActionsCtrl(
    $rootScope,
    $scope,
    $stateParams,
    $state,
    ActionbarService,
    ActionsBreadcrumbs,
    Categories,
    Export,
    FilterService,
    InsightsConfig,
    InventoryService,
    PreferenceService,
    QuickFilters,
    RhaTelemetryActionsService,
    Stats,
    System,
    SystemsService,
    Topic,
    TopicService,
    Utils) {

    const params = $state.params;
    $scope.stats = {};
    $scope.show = {
        extraTopics: false
    };

    FilterService.parseBrowserQueryParams();
    FilterService.setShowFilters(false);
    FilterService.setSearchTerm('');
    RhaTelemetryActionsService.setDataLoaded(false);

    $state.transitionTo(
        'app.actions', FilterService.updateParams(params), { notify: false });

    $scope.QuickFilters = QuickFilters;

    $scope.loader = new Utils.Loader(false);
    $scope.getSelectedProduct = FilterService.getSelectedProduct;

    let reload = $scope.loader.bind(function () {
        RhaTelemetryActionsService.reload();

        return TopicService.reload(FilterService.getSelectedProduct()).then(function () {
            const topics = TopicService.topics.filter(topic => {
                return topic.ruleBinding !== 'implicit';
            });

            $scope.featuredTopics = topics.slice(0, 3);
            $scope.extraTopics = topics.slice(3);

            let product;
            if (FilterService.getSelectedProduct() !== 'all') {
                product = FilterService.getSelectedProduct();
            }

            Topic.get('incidents', product).success((topic) => {
                let rulesWithHits = 0;

                if (topic.rules) {
                    topic.rules.forEach((rule) => {
                        if (rule.hitCount > 0) {
                            rulesWithHits++;
                        }
                    });
                }

                $scope.incidentCount = rulesWithHits;
            });
        });
    });

    $scope.$on('filterService:doFilter', reload);
    $scope.$on('osp:deployment_changed', reload);
    $scope.$on('group:change', reload);

    RhaTelemetryActionsService.setInitialSeverity($stateParams.initialSeverity);
    RhaTelemetryActionsService.setCategory($stateParams.category);
    RhaTelemetryActionsService.setRule(null);

    ActionsBreadcrumbs.init($stateParams);

    const getData = $scope.loader.bind(function () {
        System.getProductSpecificData().then(function () {
            RhaTelemetryActionsService.populateData();
        });

        return reload();
    });

    if (InsightsConfig.authenticate && !PreferenceService.get('loaded')) {
        $rootScope.$on('user:loaded', getData);
    } else {
        getData();
    }

    function loadStats () {
        let product = FilterService.getSelectedProduct();
        if (product === 'all') {
            product = undefined;
        }

        Stats.getRules({
            product: product
        }).then(function (res) {
            $scope.stats.rules = res.data;
            setCategoryTopics(res.data);
        });

        Stats.getSystems({
            product: product,
            minSeverity: 'CRITICAL'
        }).then(function (res) {
            $scope.stats.systems = res.data;
        });
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

    $scope.$on('filterService:doFilter', loadStats);
    $scope.$on('group:change', loadStats);

    loadStats();

    if (InsightsConfig.allowExport) {
        ActionbarService.addExportAction(function () {
            Export.getReports();
        });
    }
}

statesModule.controller('ActionsCtrl', ActionsCtrl);
