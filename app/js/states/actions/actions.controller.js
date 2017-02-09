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
    ActionsBreadcrumbs,
    FilterService,
    InsightsConfig,
    InventoryService,
    PreferenceService,
    QuickFilters,
    RhaTelemetryActionsService,
    System,
    SystemsService,
    TopicService,
    Utils,
    Stats) {

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
        });
    });

    $scope.$on('filterService:doFilter', reload);
    $scope.$on('osp:deployment_changed', reload);

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
        });

        Stats.getSystems({
            product: product,
            minSeverity: 'ERROR'
        }).then(function (res) {
            $scope.stats.systems = res.data;
        });
    }

    $scope.$on('filterService:doFilter', loadStats);

    loadStats();
}

statesModule.controller('ActionsCtrl', ActionsCtrl);
