'use strict';

const componentsModule = require('../../');
const diff = require('lodash/difference');
const partition = require('lodash/partition');
const groupBy = require('lodash/groupBy');
const map = require('lodash/map');
const find = require('lodash/find');
const pick = require('lodash/pick');
const priv = {};
const UNREGISTER_TYPE_CONFICT =
    'js/components/inventory/inventoryActions/unregisterConflict.html';

/**
 * @ngInject
 */
function systemListCtrl($scope,
                         $rootScope,
                         $location,
                         $modal,
                         $state,
                         Utils,
                         SystemsService,
                         InventoryService,
                         InsightsConfig,
                         Group,
                         GroupService,
                         MaintenanceService,
                         gettextCatalog,
                         TemplateService,
                         sweetAlert,
                         ListTypeService,
                         FilterService,
                         ActionbarService,
                         Export,
                         Products,
                         User) {

    const DEFAULT_PAGE_SIZE = 15;
    const DEFAULT_PREDICATE = 'toString';
    const params = $state.params;
    let systemModal = null;

    $scope.state = $state.current.name;
    $scope.showSystemModal = InventoryService.showSystemModal;
    $scope.groupSystems = GroupService.groupSystems;
    $scope.getListType = ListTypeService.getType;
    $scope.listTypes = ListTypeService.types();
    $scope.plans = MaintenanceService.plans;
    $scope.isPortal = InsightsConfig.isPortal;
    $scope.config = InsightsConfig;
    $scope.loading = true;
    $scope.allSelected = false;
    $scope.reallyAllSelected = false;
    $scope.Group = Group;
    $scope.checkboxes = new Utils.Checkboxes('system_id');

    priv.visiblySelectedSystemsCount = function () {
        let value = $scope.systems.filter(system => {
            return ($scope.checkboxes.items.hasOwnProperty(system.system_id) &&
                $scope.checkboxes.items[system.system_id] === true);
        }).length;

        return value;
    };

    priv.setTotalSystemsSelected = function () {
        if ($scope.reallyAllSelected) {
            $scope.totalSystemsSelected = $scope.totalSystems;

            // remove systems in view that are not checked
            $scope.totalSystemsSelected -=
                (Object.keys($scope.checkboxes.items).length -
                    priv.visiblySelectedSystemsCount());
        } else {
            $scope.totalSystemsSelected = priv.visiblySelectedSystemsCount();
        }
    };

    priv.updateCheckboxes = function () {
        if ($scope.systems) {
            $scope.checkboxes.update($scope.systems);

            if (priv.visiblySelectedSystemsCount() === $scope.systems.length &&
                !$scope.loading) {
                $scope.allSelected = true;
            } else {
                $scope.allSelected = false;
                $scope.reallyAllSelected = false;
            }

            priv.setTotalSystemsSelected();
        }
    };

    priv.addSystems = function (newSys, oldSys) {
        if ($scope.reallyAllSelected) {
            $scope.checkboxes.checkboxChecked(true, diff(newSys, oldSys));
        }
    };

    priv.initSorter = function () {
        const predicate = $scope.defaultPredicate || DEFAULT_PREDICATE;
        let reverse = false;

        if ($location.search().sort_dir) {
            reverse = $location.search().sort_dir === 'ASC' ? false : true;
        }

        $scope.sorter = new Utils.Sorter({
            predicate: predicate,
            reverse: reverse
        }, priv.getData);
    };

    priv.getData = function (paginate) {
        paginate = paginate || $scope.paginate || true;
        $scope.loading = true;

        $scope.getSystems(paginate, $scope.sorter, $scope.pager)
            .then(res => {
                $scope.systems = res.data.resources;
                $scope.totalSystems = res.data.total;
                $scope.loading = false;
            });
    };

    priv.cleanTheScope = function () {
        $scope.pager = new Utils.Pager($scope.pageSize || DEFAULT_PAGE_SIZE);
        priv.initSorter();
        $scope.checkboxes.reset();
    };

    priv.init = function () {
        $scope.loading = true;

        // initialize sorter, pager and checkboxes
        priv.cleanTheScope();

        //get system types
        SystemsService.getSystemTypesAsync().then(() => {
            priv.getData(true);
        });
    };

    priv.init();

    $scope.doScroll = function () {
        $location.search('page', $scope.pager.currentPage);
        $location.search('pageSize', $scope.pager.perPage);
        priv.getData(true);
        $scope.pager.update();
        $scope.checkboxes.reset();
    };

    $scope.selectAll = function () {
        $scope.allSelected = !$scope.allSelected;

        // disabling the select all checkbox will also deselect everything unseen
        if ($scope.reallyAllSelected) {
            $scope.reallyAllSelected = false;
        }
    };

    $scope.reallySelectAll = function () {
        // select ALL, not just all visible
        if (!$scope.allSystems) {
            // first load of all systems
            $scope.loading = true;
            $scope.getAllSystems($scope.sorter, $scope.pager)
                .then(res => {
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

    $scope.deselectAll = function () {
        $scope.reallyAllSelected = false;
        $scope.allSelected = false;
        $scope.checkboxes.reset();
    };

    $scope.systemsToAction = function () {
        // assume true if the system is not shown in the view
        if ($scope.reallyAllSelected) {
            return $scope.allSystems.filter(system => {
                return (!$scope.checkboxes.items.hasOwnProperty(system.system_id) ||
                        ($scope.checkboxes.items.hasOwnProperty(system.system_id) &&
                        $scope.checkboxes.items[system.system_id] === true));
            });
        } else {
            return $scope.checkboxes.getSelected($scope.systems);
        }
    };

    $scope.isFixableSelected = function () {
        return $scope.systemsToAction()
            .some(system => system.report_count);
    };

    $scope.removeFromGroup = function () {
        Group.removeSystems(Group.current(), map($scope.systemsToAction(), 'system_id'))
            .then($scope.reloadInventory);
    };

    priv.canUnregisterSystem = function (system) {
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

    $scope.isUnregistrableSelected = function () {
        return $scope.systemsToAction()
            .filter(priv.canUnregisterSystem).length > 0;
    };

    $scope.doUnregisterSelected = function () {
        const selected = $scope.systemsToAction();
        const parts = partition(selected, priv.canUnregisterSystem);

        function unregister() {
            SystemsService.unregisterSelectedSystems(parts[0]);
        }

        if (!parts[1].length) {
            unregister();
        } else {
            // some systems that cannot be unregistered on their own (e.g. docker image)
            // are selected --> warn user about that

            let roles = groupBy(parts[1], 'system_type_id');
            roles = map(roles, function (systems) {
                const system = systems[0];
                return {
                    name: Products[system.product_code].roles[system.role].fullName,
                    count: systems.length
                };
            });

            TemplateService.renderTemplate(UNREGISTER_TYPE_CONFICT, {
                roles: roles,
                validCount: parts[0].length
            }).then(function (html) {
                const opts = {
                    title: gettextCatalog.getPlural(parts[1].length,
                        '1 system cannot be unregistered',
                        '{{count}} systems cannot be unregistered',
                        {count: parts[1].length}),
                    html
                };

                return sweetAlert(opts);
            }).then(unregister);
        }
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

    $scope.addToPlan = function (existingPlan) {
        let systems = $scope.systemsToAction();
        if (!systems.length) {
            return;
        }

        MaintenanceService.showMaintenanceModal(systems,
                                                $scope.ruleDetails || null,
                                                existingPlan);
    };

    function cleanAndGetData() {
        priv.cleanTheScope();
        priv.getData();
    }

    $rootScope.$on('productFilter:change', priv.getData());

    $scope.$on('group:change', cleanAndGetData);
    $scope.$on('filterService:doFilter', cleanAndGetData);
    $scope.$on('systems:unregistered', priv.cleanTheScope);
    $scope.$on('reload:data', priv.cleanTheScope);

    $scope.$watchCollection('checkboxes.items', priv.updateCheckboxes);
    $scope.$watchCollection('systems', priv.addSystems);

    if (params.machine) {
        const system = {
            system_id: params.machine
        };

        $scope.showSystemModal(system, true);
    }
}

function systemList() {
    return {
        templateUrl: 'js/components/system/systemList/systemList.html',
        restrict: 'E',
        scope: {
            getSystems: '=',
            getAllSystems: '=',
            paginate: '=?',
            ruleDetails: '=?',
            defaultPredicate: '@?',
            pageSize: '@?',
            noListTypes: '@?',
            noActions: '@?',
            noRegisterMore:'@?'
        },
        controller: systemListCtrl
    };
}

componentsModule.directive('systemList', systemList);
