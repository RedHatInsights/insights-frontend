/*global require*/
'use strict';

const componentsModule = require('../../');
const findWhere = require('lodash/collection/findWhere');
const get = require('lodash/object/get');

/**
 * @ngInject
 */
function ActionsRuleCtrl(
        $scope,
        $rootScope,
        $stateParams,
        $timeout,
        $modal,
        $location,
        $q,
        RhaTelemetryActionsService,
        ActionsBreadcrumbs,
        AnsibleService,
        InsightsConfig,
        ListTypeService,
        User,
        $state,
        System,
        FilterService,
        Report,
        SystemsService,
        PermalinkService,
        PreferenceService,
        Utils,
        QuickFilters,
        MaintenanceService,
        Topic) {

    let params = $state.params;
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

    $scope.ruleHasPlaybook = function () {
        if ($scope.ruleDetails) {
            return AnsibleService.checkPlaybook($scope.ruleDetails.rule_id);
        }

        return false;
    };

    $scope.openPlaybookModal = rejectIfNoSystemSelected(function () {
        $modal.open({
            templateUrl: 'js/components/playbook/playbookModal.html',
            windowClass: 'modal-playbook modal-wizard ng-animate-enabled',
            backdropClass: 'system-backdrop ng-animate-enabled',
            controller: 'PlaybookModalCtrl',
            resolve: {
                system: function () {
                    return null;
                },

                systems: function () {
                    return $scope.checkboxes.getSelected($scope.ruleSystems);
                },

                rule: function () {
                    return RhaTelemetryActionsService.getRuleDetails();
                }
            }
        });
    });

    function rejectIfNoSystemSelected (fn) {
        return function () {
            let selectedSystems = $scope.checkboxes.getSelected($scope.ruleSystems);
            $scope.setNoSystemsSelected(selectedSystems.length === 0);
            if (selectedSystems.length) {
                return fn();
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

    $state.transitionTo(
        'app.actions-rule',
        FilterService.updateParams(params), { notify: false });

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
    $scope.predicate = 'system.hostname';
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
                $scope.ruleSystems = RhaTelemetryActionsService.getRuleSystemsPage();
                $scope.allSystems = RhaTelemetryActionsService.getRuleSystems();
                RhaTelemetryActionsService.setIsScrolling(false);
            });

        let systemTypesPromise =
            System.getSystemTypes().then(function (systemTypes) {
                SystemsService.setSystemTypes(systemTypes.data);
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

        AnsibleService.initAnswers();

        $q.all([populateDetailsPromise, systemTypesPromise, topicBreadCrumbPromise,
            productSpecific])
            .finally(function () {
                $scope.loading = false;
                priv.initialDisplay();
            });
    }

    priv.initialDisplay = function () {
        let search = $location.search();
        let machine_id = search.machine;
        let report;
        let reports;

        if (!machine_id) {
            return;
        }

        reports = $scope.getReportDetails();
        report  = findWhere(reports, { machine_id: machine_id });

        if (report && report.system) {
            $scope.showSystem(report.system);
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

    $scope.addToPlan = rejectIfNoSystemSelected(function () {
        var systems = $scope.checkboxes.getSelected($scope.ruleSystems);
        if (!systems.length) {
            return;
        }

        let rule = RhaTelemetryActionsService.getRuleDetails();
        MaintenanceService.showMaintenanceModal(null, systems, rule);
    });
}

componentsModule.controller('ActionsRuleCtrl', ActionsRuleCtrl);
