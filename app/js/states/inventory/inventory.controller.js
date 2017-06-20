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
        Group) {

    $scope.Group = Group;

    function updateParams(params) {
        params = FilterService.updateParams(params);
        if (!params.sort_field) {
            params.sort_field = InventoryService.getSortField();
        }

        if (!params.sort_dir) {
            params.sort_dir = InventoryService.getSortDirection();
        }

        return params;
    }

    // remove this when we re-factor table view
    $scope.getSystemName = Utils.getSystemDisplayName;
    $scope.showActions = InventoryService.showSystemModal;

    $scope.listTypes = ListTypeService.types();
    $scope.setListType = ListTypeService.setType;

    FilterService.setSearchTerm('');
    FilterService.setShowFilters(false);

    let params = $state.params;
    $state.transitionTo('app.inventory', updateParams(params), { notify: false });

    $scope.QuickFilters = QuickFilters;
    $scope.systems = [];
    $scope.allSystems = null;
    $scope.errored = false;
    $scope.actionFilter = null;
    $scope.loading = InventoryService.loading;
    $scope.reloading = false;

    $scope.sorter = new Utils.Sorter(false, order);
    $scope.sorter.predicate = 'toString';

    $scope.allSelected = false;
    $scope.reallyAllSelected = false;

    $scope.$on('reload:data', function () {
        cleanTheScope();
        initInventory(false);
    });

    $scope.$on('group:change', function () {
        cleanTheScope();
        initInventory();
    });

    $scope.$on('filterService:doFilter', function () {
        cleanTheScope();
        getData(false);
    });

    $scope.$on('osp:deployment_changed', function () {
        cleanTheScope();
        initInventory();
    });

    $scope.$on('systems:unregistered', function () {
        cleanTheScope();
        initInventory();
    });

    let systemModal = null;

    $scope.isPortal = InsightsConfig.isPortal;

    function cleanTheScope() {
        $scope.checkboxes.reset();
    }

    function initInventory() {
        //get system types
        $scope.loading = true;
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

        //sort field
        if (InventoryService.getSortField()) {
            query.sort_by = InventoryService.getSortField();
        }

        //sort direction
        if (InventoryService.getSortDirection()) {
            query.sort_dir = InventoryService.getSortDirection();
        }

        //pagination
        if (paginate) {
            query.page_size = InventoryService.getPageSize();
            query.page = InventoryService.getPage();
        }

        return query;
    }

    function getData(scrolling) {
        $scope.loading = true;

        if (!scrolling) {
            $scope.reloading = true;
            InventoryService.goToPage(0);
        }

        function getSystemsResponseHandler(response) {
            let systems = [];

            if (FilterService.getParentNode()) {
                systems = response;
            } else {
                systems = response.resources;
            }

            if (scrolling) {
                $scope.systems = $scope.systems.concat(response.resources);
                InventoryService.setIsScrolling(false);
                InventoryService.setTotal(response.total);
            } else {
                $scope.systems = response.resources;
                InventoryService.setTotal(response.total);
            }

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
        InventoryService.nextPage();
        InventoryService.setIsScrolling(true);
        getData(true);
    };

    $scope.disableScroll = function () {
        let disable = false;
        if (InventoryService.getIsScrolling() ||
            !$scope.systems ||
            $scope.systems.length >= InventoryService.getTotal()) {

            disable = true;
        }

        return disable;
    };

    function parseBrowserQueryParams() {
        FilterService.parseBrowserQueryParams();
        if (params.sort_field) {
            InventoryService.setSortField(params.sort_field);
            if (params.sort_dir) {
                InventoryService.setSortDirection(params.sort_dir);
            }
        }
    }

    parseBrowserQueryParams();
    System.getProductSpecificData();

    if (InsightsConfig.authenticate && !PreferenceService.get('loaded')) {
        $rootScope.$on('user:loaded', function () {
            initInventory();
        });
    } else {
        initInventory();
    }

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

    function order() {
        $scope.systems = $filter('orderBy')($scope.systems,
            ['_type',
            ($scope.sorter.reverse ?
                '-' + $scope.sorter.predicate :
                $scope.sorter.predicate)]);
    }

    $scope.sort = function (column) {
        $scope.loading = true;
        $scope.predicate = column;

        // just changing the sort direction
        if (column === InventoryService.getSortField()) {
            InventoryService.toggleSortDirection();
            $scope.reverse = !$scope.reverse;
        }
        else {
            InventoryService.setSortField(column);
            InventoryService.setSortDirection('ASC');
            $scope.reverse = false;

            // special case where we are sorting by timestamp but visually
            // showing timeago
            if (column === 'last_check_in') {
                InventoryService.setSortDirection('DESC');
            }
        }

        // if we have the full inventory list then use local sorting
        if ($scope.systems.length === InventoryService.getTotal()) {
            $scope.sorter.predicate = column;
            $scope.sorter.reverse = $scope.reverse;
            order();
            $scope.loading = false;
        }
        else {
            // reset dataset
            cleanTheScope();
            getData(false);
        }
    };

    $scope.selectAll = function () {
        $scope.allSelected = !$scope.allSelected;

        // disabling the select all checkbox will also deselect everything unseen
        if ($scope.reallyAllSelected) {
            $scope.reallyAllSelected = false;
        }
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

        // if all systems are shown just count the checkboxes
        if ($scope.systems.length === InventoryService.getTotal()) {
            $scope.totalSystemsSelected = visiblySelectedSystemsCount();
        }
        else if ($scope.reallyAllSelected) {
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
        return $scope.systems.filter(system => {
            return ($scope.checkboxes.items.hasOwnProperty(system.system_id) &&
                $scope.checkboxes.items[system.system_id] === true);
        }).length;
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
}

statesModule.controller('InventoryCtrl', InventoryCtrl);
