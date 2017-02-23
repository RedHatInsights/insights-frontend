/*global require*/
'use strict';

const statesModule = require('../');
const find = require('lodash/collection/find');
const pick = require('lodash/object/pick');
const diff = require('lodash/array/difference');

/**
 * @ngInject
 */
function InventoryCtrl(
        $scope,
        $rootScope,
        $filter,
        $location,
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
        Utils,
        ListTypeService) {

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

    function cleanTheScope() {
        $scope.checkboxes.reset();
    }

    function initInventory() {
        //get system types
        $scope.loading = true;
        SystemsService.populateSystemTypes(false).then(function () {
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
                InventoryService.loading = $scope.loading = false;
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

    function updateCheckboxes () {
        $scope.checkboxes.update($scope.getSelectableSystems());
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
            find(SystemsService.getSystemTypes(), {id: system.system_type_id}),
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
        }

        // if we have the full inventory list then use local sorting
        if ($scope.systems.length === InventoryService.getTotal()) {
            $scope.sorter.predicate = column;
            $scope.sorter.reverse = $scope.reverse;
            order();
        }
        else {
            // reset dataset
            cleanTheScope();
            getData(false);
        }

        $scope.loading = false;
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
                $scope.loading = false;
            });
        } else {
            // already loaded, just set the flag
            $scope.reallyAllSelected = true;
        }
    };

    $scope.totalSystems = function () {
        return InventoryService.getTotal();
    };

    $scope.allSystemsShown = function () {
        // don't show the 'select all __' prompt
        //  if all systems are already shown
        return InventoryService.getTotal() === $scope.systems.length;
    };
}

statesModule.controller('InventoryCtrl', InventoryCtrl);
