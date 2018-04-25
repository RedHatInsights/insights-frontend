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
    BreadcrumbsService,
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
    const ActionsBreadcrumbs = BreadcrumbsService;

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

    $scope.openMenu = function ($mdMenu, ev) {
        $mdMenu.open(ev);
    };

    let reload = function () {
        const promises = [];

        $scope.loading = true;

        promises.push(TopicService.reload().then(() => {
            const topics = TopicService.topics.filter(topic => {
                return topic.ruleBinding !== 'implicit';
            });

            $scope.featuredTopics = topics.slice(0, 3);
            $scope.extraTopics = topics.slice(3);
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

    if (InsightsConfig.authenticate && !PreferenceService.get('loaded')) {
        $rootScope.$on('user:loaded', reload());
    } else {
        reload();
    }

    function loadStats () {
        let promises = [];

        promises.push(Stats.getRules().then(function (res) {
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
