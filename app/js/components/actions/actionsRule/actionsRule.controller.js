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
        User,
        Utils,
        ActionbarService,
        Export,
        Group) {

    const REVERSE_TO_DIRECTION = {
        false: 'ASC',
        true: 'DESC'
    };

    $scope.allSelected = false;
    $scope.config = InsightsConfig;
    $scope.getListType = ListTypeService.getType;
    $scope.listTypes = ListTypeService.types();
    $scope.loading = true;
    $scope.noSystemsSelected = false;
    $scope.permalink = PermalinkService.make;
    $scope.predicate = 'toString';
    $scope.reallyAllSelected = false;
    $scope.reverse = false;
    $scope.ruleSystems = [];
    $scope.QuickFilters = QuickFilters;

    FilterService.parseBrowserQueryParams();
    FilterService.setShowFilters(false);
    FilterService.setSearchTerm('');

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
    RhaTelemetryActionsService.setRule($stateParams.rule);

    $scope.loading = true;
    $scope.loadingSystems = true;

    $scope.search = function (model) {
        FilterService.setSearchTerm(model);
        FilterService.doFilter();
    };

    $scope.checkboxes = new Utils.Checkboxes('system_id');
    $scope.$watchCollection('checkboxes.items', updateCheckboxes);

    function updateCheckboxes () {
        $scope.checkboxes.update($scope.ruleSystems);

        if ($scope.checkboxes.totalChecked > 0) {
            $scope.noSystemsSelected = false;
        }

        $scope.allSelected = ($scope.checkboxes.totalChecked > 0 &&
                             !$scope.checkboxes.indeterminate);

        if (!$scope.allSelected) {
            $scope.reallyAllSelected = false;
        }
    }

    $scope.plans = MaintenanceService.plans;

    $scope.showSystem = function (system) {
        InventoryService.showSystemModal(system);
    };

    /*
     * Sets pager.current_page to ruleSystems
     *
     * @param paginate gets all ruleSystems if set to false
     */
    function getData(paginate = true, resetPager = true) {
        $scope.loadingSystems = true;

        if (resetPager) {
            $scope.pager.reset();
        }

        return RhaTelemetryActionsService.getActionsRulePage(paginate, $scope.pager)
        .then(function () {
            $scope.ruleSystems = RhaTelemetryActionsService.getRuleSystems();
            $scope.totalRuleSystems = RhaTelemetryActionsService.getTotalRuleSystems();
            $scope.loadingSystems = false;
        });
    }

    $scope.paginate = function () {
        $scope.pager.update();
        $location.search('page', $scope.pager.currentPage);
        $location.search('pageSize', $scope.pager.perPage);
        getData(true, false)
        .then(function () {
            if ($scope.reallyAllSelected) {
                $scope.checkboxes.checkboxChecked(true, $scope.ruleSystems);
            } else {
                $scope.checkboxes.reset();
            }
        });
    };

    /*
     * Get first page of systems
     * If url has a machine_id then open up the systemModal with given machine_id
     */
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

        let systemsPromise =
            RhaTelemetryActionsService.initActionsRule($scope.pager)
            .then(function () {
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

                $scope.ruleSystems = RhaTelemetryActionsService.getRuleSystems();
                $scope.totalRuleSystems =
                    RhaTelemetryActionsService.getTotalRuleSystems();
                $scope.loadingSystems = false;

            });

        $q.all([SystemsService.getSystemTypesAsync(), incidentsPromise,
            topicBreadCrumbPromise, productSpecific, systemsPromise])
            .finally(function () {
                $scope.loading = false;
                let machine_id = $location.search().machine;

                if (!machine_id) {
                    return;
                }

                const system = {
                    system_id: machine_id
                };

                InventoryService.showSystemModal(system, true);
            });
    }

    function initCtrl () {
        User.asyncCurrent(function () {
            $scope.isInternal = User.current.is_internal;
        });

        $scope.checkboxes.reset();
        $scope.predicate = 'toString';
        $scope.reverse = false;

        FilterService.setQueryParam('sort_field', $scope.predicate);
        FilterService.setQueryParam('sort_direction',
            REVERSE_TO_DIRECTION[$scope.reverse]);

        //initialize pager and grab paging params from url
        $scope.pager = new Utils.Pager();
        $scope.pager.currentPage = $location.search().page ? $location.search().page :
                                                             $scope.pager.currentPage;
        $scope.pager.perPage = $location.search().pageSize ? $location.search().pageSize :
                                                             $scope.pager.perPage;

        initialDisplay();
    }

    $rootScope.$on('productFilter:change', function () {
        if ($state.current.name === 'app.actions-rule') {
            getData();
        }
    });

    $rootScope.$on('reload:data', getData);
    $rootScope.$on('group:change', getData);

    $scope.$on('account:change', getData);

    if (InsightsConfig.authenticate && !PreferenceService.get('loaded')) {
        $rootScope.$on('user:loaded', initCtrl);
    } else {
        initCtrl();
    }

    $scope.addToPlan = rejectIfNoSystemSelected(function (existingPlan) {
        var systems = systemsToAction();
        if (!systems.length) {
            return;
        }

        let rule = RhaTelemetryActionsService.getRuleDetails();
        MaintenanceService.showMaintenanceModal(systems, rule, existingPlan);
    });

    $scope.sort = function (column) {

        // just changing the sort direction
        if (column === $scope.predicate) {
            $scope.reverse = !$scope.reverse;
        }
        else {
            $scope.reverse = false;

            // special case where we are sorting by timestamp but visually
            // showing timeago
            if (column === 'last_check_in') {
                $scope.reverse = !$scope.reverse;
            }
        }

        $scope.predicate = column;

        // store sort fields in FilterService for systems query
        FilterService.setQueryParam('sort_field', $scope.predicate);
        FilterService.setQueryParam('sort_direction',
            REVERSE_TO_DIRECTION[$scope.reverse]);

        // reset dataset
        $scope.resetPaging();
        $scope.loadingSystems = true;

        return RhaTelemetryActionsService.sortActionsRulePage($scope.pager,
                                                              $scope.predicate,
                                                              $scope.reverse)
        .then(function () {
            $scope.ruleSystems = RhaTelemetryActionsService.getRuleSystems();
            $scope.totalRuleSystems = RhaTelemetryActionsService.getTotalRuleSystems();
            $scope.loadingSystems = false;
        });
    };

    // reset checkboxes and pager when sorting
    $scope.resetPaging = function () {
        $scope.checkboxes.reset();
        $scope.pager.reset();
    };

    // really select all

    // keeps track of messages to display to the user
    $scope.selectAll = function () {
        // if we previously had all systems selected, we no longer do
        if ($scope.reallyAllSelected && $scope.pager.perPage < $scope.totalRuleSystems) {
            $scope.reallyAllSelected = false;
        }
    };

    /*
     * Fetches all systems and assigns them to checkboxes
     */
    $scope.reallySelectAll = function () {
        $scope.allSelected = true;
        $scope.reallyAllSelected = true;
        getData(false, false);
    };

    /*
     * Resets checkboxes and selected variables
     */
    $scope.deselectAll = function () {
        $scope.reallyAllSelected = false;
        $scope.allSelected = false;
        $scope.checkboxes.reset();
    };

    function systemsToAction () {
        // assume true if the system is not shown in the view
        if ($scope.reallyAllSelected) {
            return RhaTelemetryActionsService.getAllSystems().filter(system => {
                return (!$scope.checkboxes.items.hasOwnProperty(system.system_id) ||
                        ($scope.checkboxes.items.hasOwnProperty(system.system_id) &&
                            $scope.checkboxes.items[system.system_id] === true));
            });
        } else {
            return $scope.checkboxes.getSelected($scope.ruleSystems);
        }
    }

    $scope.numberOfSelected = function () {
        if ($scope.reallyAllSelected) {
            const systems = RhaTelemetryActionsService.getAllSystems();
            return systems ? systems.length : 0;
        } else {
            return $scope.checkboxes.totalChecked;
        }
    };

    $scope.isIncident = IncidentsService.isIncident;

    if (InsightsConfig.allowExport) {
        ActionbarService.addExportAction(function () {
            Export.getReports(null, $stateParams.rule, Group.current().id);
        });
    }
}

componentsModule.controller('ActionsRuleCtrl', ActionsRuleCtrl);
