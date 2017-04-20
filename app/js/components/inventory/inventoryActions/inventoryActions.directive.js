'use strict';

var componentsModule = require('../../');
var find = require('lodash/find');
const partition = require('lodash/collection/partition');
const clone = require('lodash/clone');
const groupBy = require('lodash/groupBy');
const map = require('lodash/collection/map');

const UNREGISTER_TYPE_CONFICT =
    'js/components/inventory/inventoryActions/unregisterConflict.html';

/**
 * @ngInject
 */
function inventoryActionsCtrl(
    $scope,
    $rootScope,
    InventoryService,
    FilterService,
    SystemsService,
    MaintenanceService,
    SweetAlert,
    $timeout,
    gettextCatalog,
    TemplateService,
    Products,
    ListTypeService,
    InsightsConfig) {

    $scope.getTotal = InventoryService.getTotal;
    $scope.listTypes = ListTypeService.types();
    $scope.listType =  ListTypeService.getType;
    $scope.config = InsightsConfig;
    $scope.plans = MaintenanceService.plans;

    $scope.getSortLabel = function (field) {
        var item = find($scope.sortItems, {field: field});
        return item.label;
    };

    $scope.$watch('checkboxes.items', function () {
        const selected = $scope.systemsToAction();

        if (selected.length && !$scope.isUnregistrableSelected()) {
            $scope.unregisterButtonTooltip = gettextCatalog.getString(
                'Selected systems cannot be unregistered alone. ' +
                'Remove their respective deployment.');
        } else {
            $scope.unregisterButtonTooltip = null;
        }
    }, true);

    $scope.doUnregisterSelected = function () {
        const selected = $scope.systemsToAction();
        const parts = partition(selected, $scope.canUnregisterSystem);

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
            }).then(function (text) {
                const opts = clone(SweetAlert.DEFAULT_WARNING_OPTS);
                opts.title = gettextCatalog.getPlural(parts[1].length,
                    '1 system cannot be unregistered',
                    '{{count}} systems cannot be unregistered',
                    {count: parts[1].length});
                opts.text = text;

                return SweetAlert.swal(opts);
            }).then(function (decision) {
                if (decision) {

                    // this is ugly but it takes SweetAlert about 100ms to retract
                    // during that period a new SweetAlert cannot be open
                    $timeout(unregister, 200);
                }
            });
        }
    };

    $scope.isUnregistrableSelected = function () {
        return $scope.systemsToAction()
            .filter($scope.canUnregisterSystem).length > 0;
    };

    $scope.isFixableSelected = function () {
        return $scope.systemsToAction()
            .some(system => system.report_count);
    };

    $scope.sortItems = [
        {
            field: 'toString',
            label: gettextCatalog.getString('Name')
        },
        {
            field: 'created_at',
            label: gettextCatalog.getString('Registration Date')
        },
        {
            field: 'last_check_in',
            label: gettextCatalog.getString('Last Check In')
        },
        {
            field: 'report_count',
            label: gettextCatalog.getString('Number of Actions')
        },
        {
            field: 'system_type_id',
            label: gettextCatalog.getString('Type')
        }
    ];

    $scope.getSortDirection = InventoryService.getSortDirection;
    $scope.getSortField = InventoryService.getSortField;

    $scope.sortLabel = 'Hostname';

    $scope.getSortType = function () {
        var sortField = InventoryService.getSortField();
        if (sortField === 'created_at' || sortField === 'last_check_in') {
            return 'num';
        } else if (sortField === 'report_count') {
            return 'amount';
        } else {
            return 'alpha';
        }
    };

    $scope.doSort = function (item) {
        InventoryService.setSortField(item.field);
        $scope.sortLabel = item.label;

        //default hostname to ascending
        //default registration date, last check in, # actions to DESC
        //because that's what I would want most often when
        //selecting to sort by each
        if (item.field === 'hostname') {
            InventoryService.setSortDirection('ASC');
        } else {
            InventoryService.setSortDirection('DESC');
        }

        FilterService.doFilter();
    };

    $scope.toggleSortDirection = function () {
        if (InventoryService.getSortDirection() === 'ASC') {
            InventoryService.setSortDirection('DESC');
        } else {
            InventoryService.setSortDirection('ASC');
        }

        FilterService.doFilter();
    };

    $scope.getSortIconClasses = function () {
        return {
                'fa-sort-alpha-asc':
                    $scope.getSortDirection() === 'ASC' &&
                    $scope.getSortType() === 'alpha',
                'fa-sort-alpha-desc':
                    $scope.getSortDirection() === 'DESC' &&
                    $scope.getSortType() === 'alpha',
                'fa-sort-numeric-asc':
                    $scope.getSortDirection() === 'ASC' &&
                    $scope.getSortType() === 'num',
                'fa-sort-numeric-desc':
                    $scope.getSortDirection() === 'DESC' &&
                    $scope.getSortType() === 'num',
                'fa-sort-amount-asc':
                    $scope.getSortDirection() === 'ASC' &&
                    $scope.getSortType() === 'amount',
                'fa-sort-amount-desc':
                    $scope.getSortDirection() === 'DESC' &&
                    $scope.getSortType() === 'amount'
            };
    };

    $scope.addToPlan = function (newPlan) {
        let systems = $scope.systemsToAction();
        if (!systems.length) {
            return;
        }

        MaintenanceService.showMaintenanceModal(null, systems, null, newPlan);
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
}

function inventoryActions() {
    return {
        templateUrl: 'js/components/inventory/inventoryActions/inventoryActions.html',
        restrict: 'E',
        replace: true,
        controller: inventoryActionsCtrl
    };
}

componentsModule.directive('inventoryActions', inventoryActions);
