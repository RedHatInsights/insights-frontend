'use strict';

var componentsModule = require('../../');
var find = require('lodash/find');
const partition = require('lodash/partition');
const groupBy = require('lodash/groupBy');
const map = require('lodash/map');

const UNREGISTER_TYPE_CONFICT =
    'js/components/inventory/inventoryActions/unregisterConflict.html';

/**
 * @ngInject
 */
function inventoryActionsCtrl(
    $scope,
    $rootScope,
    sweetAlert,
    FilterService,
    SystemsService,
    MaintenanceService,
    $timeout,
    gettextCatalog,
    TemplateService,
    Products,
    ListTypeService,
    InsightsConfig,
    Group,
    GroupService) {

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

    $scope.sortLabel = 'Hostname';

    $scope.addToPlan = function (existingPlan) {
        let systems = $scope.systemsToAction();
        if (!systems.length) {
            return;
        }

        MaintenanceService.showMaintenanceModal(systems, null, existingPlan);
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

    $scope.removeFromGroup = function () {
        Group.removeSystems(Group.current(), map($scope.systemsToAction(), 'system_id'))
            .then($scope.reloadInventory);
    };

    $scope.groupSystems = GroupService.groupSystems;
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
