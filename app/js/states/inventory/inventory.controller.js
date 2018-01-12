/*global require*/
'use strict';

const statesModule = require('../');
const find = require('lodash/find');
const pick = require('lodash/pick');
const diff = require('lodash/difference');

/**
 * @ngInject
 */
function InventoryCtrl(
        $filter,
        $location,
        $modal,
        $rootScope,
        $scope,
        $state,
        System,
        InventoryService,
        MultiButtonService,
        SystemsService,
        InsightsConfig,
        ReloadService,
        Account,
        FilterService,
        QuickFilters,
        PreferenceService,
        User,
        Utils,
        ListTypeService,
        ActionbarService,
        Export,
        Group,
        VMAAS_SYSTEMS) {
    const DEFAULT_PAGE_SIZE = 15;
    const DEFAULT_PREDICATE = 'toString';

    $scope.Group = Group;
    $scope.filter = FilterService;

    function updateParams(params) {
        params = FilterService.updateParams(params);
        if (!params.sort_field) {
            params.sort_field = $scope.sorter.predicate;
        }

        if (!params.sort_dir) {
            params.sort_dir = $scope.sorter.getSortDirection();
        }

        return params;
    }

    // remove this when we re-factor table view
    $scope.getSystemName = Utils.getSystemDisplayName;
    $scope.showActions = InventoryService.showSystemModal;

    $scope.listTypes = ListTypeService.types();

    FilterService.setShowFilters(false);

    $scope.QuickFilters = QuickFilters;
    $scope.systems = [];
    $scope.allSystems = null;
    $scope.errored = false;
    $scope.actionFilter = null;
    $scope.loading = InventoryService.loading;
    $scope.reloading = false;

    FilterService.parseBrowserQueryParams();
    System.getProductSpecificData();

    let params = $state.params;

    if (InsightsConfig.authenticate && !PreferenceService.get('loaded')) {
        $rootScope.$on('user:loaded', function () {
            initInventory();
            $state.transitionTo('app.inventory', updateParams(params), { notify: false });
        });
    } else {
        initInventory();
        $state.transitionTo('app.inventory', updateParams(params), { notify: false });
    }

    $scope.allSelected = false;
    $scope.reallyAllSelected = false;

    $scope.$on('reload:data', function () {
        cleanTheScope();
        initInventory(false);
    });

    $scope.$on('group:change', function () {
        cleanTheScope();
        getData(false);
    });

    $scope.$on('filterService:doFilter', function () {
        cleanTheScope();
        getData(false);
    });

    $scope.$on('systems:unregistered', function () {
        cleanTheScope();
        getData();
    });

    let systemModal = null;

    $scope.isPortal = InsightsConfig.isPortal;

    function initSorter() {
        let reverse = false;

        if ($location.search().sort_dir) {
            reverse = $location.search().sort_dir === 'ASC' ? false : true;
        }

        $scope.sorter = new Utils.Sorter({
            predicate: $location.search().sort_field || DEFAULT_PREDICATE,
            reverse: reverse
        }, getData);
    }

    function cleanTheScope() {
        $scope.pager = new Utils.Pager(DEFAULT_PAGE_SIZE);
        initSorter();
        $scope.checkboxes.reset();
    }

    function initInventory() {
        $scope.loading = true;

        //initialize the sorter
        initSorter();

        //initialize pager and grab paging params from url
        $scope.pager = new Utils.Pager(DEFAULT_PAGE_SIZE);
        $scope.pager.currentPage = $location.search().page ? $location.search().page :
                                                             $scope.pager.currentPage;
        $scope.pager.perPage = $location.search().pageSize ? $location.search().pageSize :
                                                             $scope.pager.perPage;

        //get system types
        SystemsService.getSystemTypesAsync().then(function () {
            getData(false);
        });
    }

    function buildRequestQueryParams (paginate) {
        const query = FilterService.buildRequestQueryParams();

        // offline / systems not checking in
        if (FilterService.getOffline() !== FilterService.getOnline()) {
            query.offline = FilterService.getOffline().toString();
        }

        //search term
        if (FilterService.getSearchTerm()) {
            query.search_term = FilterService.getSearchTerm();
        }

        //sort field/direction
        query.sort_by = $scope.sorter.predicate;
        FilterService.setQueryParam('sort_field', $scope.sorter.predicate);
        FilterService.setQueryParam('sort_dir', $scope.sorter.getSortDirection());

        // special case where we are sorting by timestamp but visually
        // showing timeago
        if ($scope.sorter.predicate === 'last_check_in') {
            query.sort_dir = $scope.sorter.getSortDirection() === 'ASC' ? 'DESC' : 'ASC';
        } else {
            query.sort_dir = $scope.sorter.getSortDirection();
        }

        //pagination
        if (paginate) {
            query.page_size = $scope.pager.perPage;

            // programmatic page starts at 0 while ui page starts at 1
            query.page = ($scope.pager.currentPage - 1);
        }

        return query;
    }

    function getData(paginate) {
        $scope.loading = true;

        if (!paginate) {
            $scope.reloading = true;
        }

        function getSystemsResponseHandler(response) {
            let systems = [];

            if (FilterService.getParentNode()) {
                systems = response;
            } else {
                systems = response.resources;
            }

            $scope.systems = response.resources;
            InventoryService.setTotal(response.total);

            getSystemRhsaCounts();

            SystemsService.systems = $scope.systems;
        }

        let query = buildRequestQueryParams(true);

        let promise = null;
        if (FilterService.getParentNode() !== null) {
            query.includeSelf = true;
            promise = System.getSystemLinks(FilterService.getParentNode(), query);
        } else {
            promise = System.getSystemsLatest(query);
        }

        promise.success(getSystemsResponseHandler)
            .error(function () {
                $scope.errored = true;
            }).finally(function () {
                InventoryService.loading = $scope.loading = $scope.reloading = false;
            });
    }

    $scope.applyActionFilter = function (filter) {
        $scope.actionFilter = filter;
    };

    $scope.doScroll = function () {
        $location.search('page', $scope.pager.currentPage);
        $location.search('pageSize', $scope.pager.perPage);
        getData(true);
        $scope.pager.update();
        $scope.checkboxes.reset();
    };

    $scope.getSelectableSystems = function () {
        return $scope.systems;
    };

    $scope.checkboxes = new Utils.Checkboxes('system_id');
    setTotalSystemsSelected();

    function updateCheckboxes () {
        $scope.checkboxes.update($scope.getSelectableSystems());

        if (visiblySelectedSystemsCount() === $scope.systems.length && !$scope.loading) {
            $scope.allSelected = true;
        } else {
            $scope.allSelected = false;
            $scope.reallyAllSelected = false;
        }

        setTotalSystemsSelected();
    }

    function addSystems(newSys, oldSys) {
        if ($scope.reallyAllSelected) {
            $scope.checkboxes.checkboxChecked(true, diff(newSys, oldSys));
        }
    }

    $scope.$watchCollection('checkboxes.items', updateCheckboxes);
    $scope.$watchCollection('systems', addSystems);

    $scope.canUnregisterSystem = function (system) {
        var canSelect = true;
        var invalidTypes = [{
            product_code: 'osp',
            role: 'compute'
        },{
            product_code: 'osp',
            role: 'controller'
        },{
            product_code: 'osp',
            role: 'director'
        },{
            product_code: 'docker',
            role: 'image'
        },{
            product_code: 'docker',
            role: 'container'
        },{
            product_code: 'rhev',
            role: 'manager'
        },{
            product_code: 'rhev',
            role: 'hypervisor'
        }];
        var systemType = pick(

            // this is safe as system types are awaited within initInventory()
            SystemsService.getSystemTypeUnsafe(system.system_type_id),
            'product_code',
            'role');

        if (find(invalidTypes, systemType)) {
            canSelect = false;
        }

        return canSelect;
    };

    $scope.selectAll = function () {
        $scope.allSelected = !$scope.allSelected;

        // disabling the select all checkbox will also deselect everything unseen
        if ($scope.reallyAllSelected) {
            $scope.reallyAllSelected = false;
        }
    };

    $scope.deselectAll = function () {
        $scope.reallyAllSelected = false;
        $scope.allSelected = false;
        $scope.checkboxes.reset();
    };

    $scope.reallySelectAll = function () {
        function getAllSystems() {

            // For when ALL are selected, not just all visible
            // condensed version of 'getData()'
            let query = buildRequestQueryParams(false);
            let promise = null;

            if (FilterService.getParentNode() !== null) {
                query.includeSelf = true;
                promise = System.getSystemLinks(FilterService.getParentNode(), query);
            } else {
                promise = System.getSystemsLatest(query);
            }

            return promise;
        }

        // select ALL, not just all visible
        if ($scope.allSystems === null) {
            // first load of all systems
            $scope.loading = true;
            getAllSystems().then(res => {
                $scope.allSystems = res.data.resources;
                $scope.reallyAllSelected = true;
                $scope.totalSystemsSelected = $scope.allSystems.length;
                $scope.loading = false;
            });
        } else {
            // already loaded, just set the flag
            $scope.reallyAllSelected = true;
            $scope.totalSystemsSelected = $scope.allSystems.length;
        }
    };

    $scope.totalSystems = function () {
        return InventoryService.getTotal();
    };

    function setTotalSystemsSelected () {

        if ($scope.reallyAllSelected) {
            $scope.totalSystemsSelected = InventoryService.getTotal();

            // remove systems in view that are not checked
            $scope.totalSystemsSelected -=
                (Object.keys($scope.checkboxes.items).length -
                    visiblySelectedSystemsCount());
        } else {
            $scope.totalSystemsSelected = visiblySelectedSystemsCount();
        }
    }

    function visiblySelectedSystemsCount () {
        let value = $scope.systems.filter(system => {
            return ($scope.checkboxes.items.hasOwnProperty(system.system_id) &&
                $scope.checkboxes.items[system.system_id] === true);
        }).length;

        return value;
    }

    $scope.allSystemsShown = function () {
        // don't show the 'select all __' prompt
        //  if all systems are already shown
        return InventoryService.getTotal() === $scope.systems.length;
    };

    /**
     * calls register new system modal
     */
    $scope.registerSystem = function () {
        var systemLimitReached = false;
        User.asyncCurrent(function (user) {
            systemLimitReached = user.current_entitlements ?
                user.current_entitlements.systemLimitReached :
                !user.is_internal;

            if (user.current_entitlements && user.current_entitlements.unlimitedRHEL) {
                systemLimitReached = false;
            }
        });

        openModal({
            templateUrl: 'js/components/system/addSystemModal/' +
                (systemLimitReached ? 'upgradeSubscription.html' : 'addSystemModal.html'),
            windowClass: 'system-modal ng-animate-enabled',
            backdropClass: 'system-backdrop ng-animate-enabled',
            controller: 'AddSystemModalCtrl'
        });
    };

    /**
     * opens modal if a modal isn't currently opened
     */
    function openModal(opts) {
        if (systemModal) {
            return; // Only one modal at a time please
        }

        systemModal = $modal.open(opts);
        systemModal.result.finally(function () {
            systemModal = null;
        });
    }

    if (InsightsConfig.allowExport) {
        ActionbarService.addExportAction(function () {
            let stale;

            if (FilterService.getOnline() && !FilterService.getOffline()) {
                stale = false;
            }

            if (!FilterService.getOnline() && FilterService.getOffline()) {
                stale = true;
            }

            Export.getSystems(Group.current().id, stale, FilterService.getSearchTerm());
        });
    }

    if (params.machine) {
        const system = {
            system_id: params.machine
        };
        $scope.showActions(system, true);
    }

    $scope.reloadInventory = function () {
        cleanTheScope();
        getData(false);
    };

    // VMAAS
    // This function counts all the rhsas in the mock data
    // TODO: Switch this to whatever api will be necessary to get
    //       get the rhsa severity counts
    function getSystemRhsaCounts() {
        $scope.systems.forEach(function (system) {
            system.critical_rhsa_count = 0;
            system.important_rhsa_count = 0;
            system.moderate_rhsa_count = 0;
            system.low_rhsa_count = 0;

            const sys = find(VMAAS_SYSTEMS, function (vmaas) {
                return vmaas.hasOwnProperty(system.toString);
            });

            if (sys) {
                system.packages = sys[system.toString].packages;
                sys[system.toString].packages.forEach(function (pkg) {
                    system.critical_rhsa_count += pkg.critical_count;
                    system.important_rhsa_count += pkg.important_count;
                    system.moderate_rhsa_count += pkg.moderate_count;
                    system.low_rhsa_count += pkg.low_count;
                });
            }
        });
    }

    $scope.hasRhsas = function (system) {
        return system.critical_rhsa_count > 0 ||
               system.important_rhsa_count > 0 ||
               system.moderate_rhsa_count > 0 ||
               system.low_rhsa_count > 0;
    };
}

statesModule.controller('InventoryCtrl', InventoryCtrl);
