/*global require*/
'use strict';

const componentsModule = require('../../');

/**
 * @ngInject
 */
function ActionsRuleCtrl(
        $filter,
        $location,
        $modal,
        $q,
        $rootScope,
        $scope,
        $state,
        $stateParams,
        $timeout,
        ActionsBreadcrumbs,
        FilterService,
        IncidentsService,
        InsightsConfig,
        InventoryService,
        ListTypeService,
        MaintenanceService,
        PermalinkService,
        PreferenceService,
        QuickFilters,
        Report,
        RhaTelemetryActionsService,
        System,
        SystemsService,
        Topic,
        User) {

    $scope.loading = true;
    $scope.getAllSystems = RhaTelemetryActionsService.getAllSystems;

    FilterService.parseBrowserQueryParams();
    FilterService.setShowFilters(false);
    FilterService.setSearchTerm('');

    /* Temporarily disabled. Should be fixed as part of https://trello.com/c/CFOHQSd1/135
    $state.transitionTo(
        'app.actions-rule',
        FilterService.updateParams(params), { notify: false });
    */

    ActionsBreadcrumbs.init($stateParams);
    RhaTelemetryActionsService.setRule($stateParams.rule);

    $scope.loading = true;
    $scope.loadingSystems = true;

    $scope.search = function (model) {
        FilterService.setSearchTerm(model);
        FilterService.doFilter();
    };

    $scope.getData = function (paginate, sorter, pager) {

        if (!RhaTelemetryActionsService.getRuleSystems()) {
            return RhaTelemetryActionsService.initActionsRule(pager)
            .then(() => {
                let ruleDetails = RhaTelemetryActionsService.getRuleDetails();
                if (ruleDetails) {
                    $scope.ruleDetails = ruleDetails;
                    ActionsBreadcrumbs.setCrumb({
                        label: ruleDetails.description,
                        params: {
                            category: $stateParams.category,
                            rule: ruleDetails.rule_id
                        }
                    }, 2);
                }

                $scope.loading = false;
                $scope.loadingSystems = false;

                return {
                    data: {
                        total: RhaTelemetryActionsService.getTotalRuleSystems(),
                        resources: RhaTelemetryActionsService.getRuleSystems()
                    }
                };
            });
        }

        return RhaTelemetryActionsService.getActionsRulePage(paginate, pager)
        .then(() => {
            return {
                data: {
                    total: RhaTelemetryActionsService.getTotalRuleSystems(),
                    resources: RhaTelemetryActionsService.getRuleSystems()
                }
            };
        });
    };

    function initialDisplay () {
        $scope.loading = true;
        $scope.loadingSystems = true;

        let incidentsPromise = IncidentsService.init();

        let topicBreadCrumbPromise =
            Topic.get($stateParams.category).success(function (topic) {
                ActionsBreadcrumbs.setCrumb({
                    label: topic.title,
                    state: 'app.topic',
                    params: {
                        id: topic.slug ? topic.slug : topic.id
                    }
                }, 1);
            });

        let productSpecific = System.getProductSpecificData();

        $q.all([incidentsPromise, topicBreadCrumbPromise,
                productSpecific]);
    }

    function initCtrl () {
        User.asyncCurrent(function () {
            $scope.isInternal = User.current.is_internal;
        });

        initialDisplay();
    }

    if (InsightsConfig.authenticate && !PreferenceService.get('loaded')) {
        $rootScope.$on('user:loaded', initCtrl);
    } else {
        initCtrl();
    }

    $scope.isIncident = IncidentsService.isIncident;
}

componentsModule.controller('ActionsRuleCtrl', ActionsRuleCtrl);
