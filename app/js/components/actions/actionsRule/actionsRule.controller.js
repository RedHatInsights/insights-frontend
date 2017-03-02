/*global require*/
'use strict';

const componentsModule = require('../../');
const find = require('lodash/collection/find');
const get = require('lodash/object/get');

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
        InsightsConfig,
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
        User,
        Utils) {

    //let params = $state.params;
    let category = $stateParams.category;
    let priv = {};
    $scope.allSystems = [];
    $scope.getListType = ListTypeService.getType;
    $scope.listTypes = ListTypeService.types();
    $scope.noSystemsSelected = false;
    $scope.permalink = PermalinkService.make;
    $scope.ruleSystems = [];
    $scope.QuickFilters = QuickFilters;
    $scope.config = InsightsConfig;
    $scope.predicate = 'toString';
    $scope.reverse = false;

    FilterService.parseBrowserQueryParams();
    FilterService.setShowFilters(false);
    FilterService.setSearchTerm('');

    $scope.doScroll = function () {
        RhaTelemetryActionsService.nextPage();
        RhaTelemetryActionsService.setIsScrolling(true);
        $scope.ruleSystems = $scope.ruleSystems.concat(
            RhaTelemetryActionsService.getRuleSystemsPage());
        RhaTelemetryActionsService.setIsScrolling(false);
    };

    $scope.disableScroll = function () {
        let disable = false;
        if (RhaTelemetryActionsService.getIsScrolling() ||
            !$scope.ruleSystems ||
            $scope.ruleSystems.length >=
            RhaTelemetryActionsService.getTotalRuleSystems()) {
            disable = true;
        }

        return disable;
    };

    function rejectIfNoSystemSelected (fn) {
        return function () {
            let selectedSystems = $scope.checkboxes.getSelected($scope.ruleSystems);
            $scope.setNoSystemsSelected(selectedSystems.length === 0);
            if (selectedSystems.length) {
                return fn.apply(null, arguments);
            }
        };
    }

    $scope.setNoSystemsSelected = function (noSystemsSelected) {
        $scope.noSystemsSelected = noSystemsSelected;
        if (noSystemsSelected) {
            $timeout(function () {
                $scope.permalink('noSystemsSelected', true, 50, 500);
            }, 100);
        }
    };

    /* Temporarily disabled. Should be fixed as part of https://trello.com/c/CFOHQSd1/135
    $state.transitionTo(
        'app.actions-rule',
        FilterService.updateParams(params), { notify: false });
    */

    $scope.$on('group:change', getData);
    $scope.$on('filterService:doFilter', function () {
        if ($state.current.name === 'app.actions-rule') {
            getData();
        }
    });

    ActionsBreadcrumbs.init($stateParams);
    RhaTelemetryActionsService.setCategory(category);
    RhaTelemetryActionsService.setRule($stateParams.rule);

    $scope.getReportDetails = RhaTelemetryActionsService.getReportDetails;
    $scope.loading = true;
    $scope.loadingSystems = true;
    $scope.ospRuleResolution = '';

    $scope.search = {
        filters: ['system_id', 'hostname', 'display_name']
        .map(prop => function (system, query) {
            return String(get(system, prop)).includes(query);
        }),

        doFilter: function (query) {
            if (query) {
                $scope.ruleSystems = $scope.allSystems.filter(function (system) {
                    return $scope.search.filters.some(f => f(system, query));
                });
            } else {
                $scope.ruleSystems = $scope.allSystems;
            }
        }
    };

    $scope.checkboxes = new Utils.Checkboxes('system_id');
    $scope.$watchCollection('checkboxes.items', function () {
        $scope.checkboxes.update($scope.ruleSystems);
        if ($scope.checkboxes.totalChecked > 0) {
            $scope.noSystemsSelected = false;
        }
    });

    $scope.plans = MaintenanceService.plans;

    $scope.showSystem = function (system) {
        let systems;

        if (typeof InsightsConfig.actionsShowSystem === 'function') {
            return InsightsConfig.actionsShowSystem(system.toString());
        }

        systems = RhaTelemetryActionsService.getClusterAffectedSystems();
        if (typeof system === 'string' && systems && systems.hasOwnProperty(system)) {
            system = systems[system];
        }

        $modal.open({
            templateUrl: 'js/components/system/systemModal/systemModal.html',
            windowClass: 'system-modal ng-animate-enabled',
            backdropClass: 'system-backdrop ng-animate-enabled',
            controller: 'SystemModalCtrl',
            resolve: {
                system: function () {
                    return system;
                },

                rule: function () {
                    return false;
                }
            }
        });
    };

    $scope.systemToString = function (system) {
        return Utils.getSystemDisplayName(system);
    };

    function getData() {
        $scope.loading = true;

        let populateDetailsPromise =
            RhaTelemetryActionsService.populateDetails().then(function () {
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

                RhaTelemetryActionsService.setIsScrolling(true);
                RhaTelemetryActionsService.resetPaging();
                RhaTelemetryActionsService.orderRuleSystems($scope.predicate,
                    $scope.reverse);
                $scope.ruleSystems = RhaTelemetryActionsService.getRuleSystemsPage();
                $scope.allSystems = RhaTelemetryActionsService.getRuleSystems();
                RhaTelemetryActionsService.setIsScrolling(false);
            });

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

        $q.all([populateDetailsPromise, SystemsService.getSystemTypesAsync(),
            topicBreadCrumbPromise, productSpecific])
            .finally(function () {
                $scope.loading = false;
                priv.initialDisplay();
            });
    }

    priv.initialDisplay = function () {
        let search = $location.search();
        let machine_id = search.machine;

        if (!machine_id) {
            return;
        }

        const system = find($scope.allSystems, { system_id: machine_id });
        if (system) {
            $scope.showSystem(system);
        }

        $location.replace();
        $location.search('machine', null);
    };

    priv.initCtrl = function () {
        User.asyncCurrent(function () {
            $scope.isInternal = User.current.is_internal;
        });

        getData();
    };

    $rootScope.$on('productFilter:change', function () {
        if ($state.current.name === 'app.actions-rule') {
            getData();
        }
    });

    $scope.$on('account:change', getData);

    if (InsightsConfig.authenticate && !PreferenceService.get('loaded')) {
        $rootScope.$on('user:loaded', priv.initCtrl);
    } else {
        priv.initCtrl();
    }

    $scope.addToPlan = rejectIfNoSystemSelected(function (newPlan) {
        var systems = $scope.checkboxes.getSelected($scope.ruleSystems);
        if (!systems.length) {
            return;
        }

        let rule = RhaTelemetryActionsService.getRuleDetails();
        MaintenanceService.showMaintenanceModal(null, systems, rule, newPlan);
    });

    /**
     * Sorts tables and cards based on column selected
     */
    $scope.sort = function (column) {
        $scope.loading = true;

        $scope.reverse = !$scope.reverse;

        // if sorting by a different column then sort ascending unless it's last_check_in
        if ($scope.predicate !== column) {
            $scope.reverse = false;

            // last_check_in is different because we are ordering by timestamp but
            // displaying the timeago format
            if (column === 'last_check_in') {
                $scope.reverse = true;
            }
        }

        $scope.predicate = column;

        RhaTelemetryActionsService.setIsScrolling(true);
        RhaTelemetryActionsService.resetPaging();
        RhaTelemetryActionsService.orderRuleSystems($scope.predicate,
            $scope.reverse);
        $scope.ruleSystems = RhaTelemetryActionsService.getRuleSystemsPage();
        RhaTelemetryActionsService.setIsScrolling(false);

        $scope.loading = false;
    };
}

componentsModule.controller('ActionsRuleCtrl', ActionsRuleCtrl);
