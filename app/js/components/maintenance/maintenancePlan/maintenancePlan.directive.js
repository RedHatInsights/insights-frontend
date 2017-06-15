'use strict';

var componentsModule = require('../../');
var assign = require('lodash/assign');
var map = require('lodash/map');
const find = require('lodash/find');
const FileSaver = require('file-saver');
const parseHeader = require('parse-http-header');
const some = require('lodash/some');
const get = require('lodash/get');
const sortBy = require('lodash/sortBy');
const swal = require('sweetalert2');

/**
 * @ngInject
 */
function maintenancePlanCtrl(
    $modal,
    $rootScope,
    $scope,
    $timeout,
    $document,
    gettextCatalog,
    sweetAlert,
    DataUtils,
    Group,
    Maintenance,
    MaintenanceService,
    SystemsService,
    Utils) {

    $scope.pager = new Utils.Pager(10);
    $scope.loader = new Utils.Loader();
    $scope.exportPlan = Maintenance.exportPlan;
    $scope.error = null;
    $scope.MaintenanceService = MaintenanceService;

    $scope.editDateTooltip = gettextCatalog.getString(
        'Date, time and duration of a maintenance window can be defined here. ' +
        'If a maintenance window for this plan is set then Insights will verify that ' +
        'all the actions in this plan are resolved once the window ends. Insights will ' +
        'warn you this plan is not fully resolved when the maintenance window ends.');

    const CURRENT_GROUP_PREFIX = gettextCatalog.getString('Current Group');

    $scope.editBasic = new $scope.BasicEditHandler(
        $scope.plan,
        Maintenance,
        Utils,
        $scope.loader.bind(function (name, description, start, end, handler) {

            $scope.plan.description = description;
            return Maintenance.updatePlan($scope.plan.maintenance_id, {
                name: name,
                description: description,
                start: start,
                end: end
            }).then(function () {
                handler.active = false;

                if ($scope.plan.end !== end || $scope.plan.start !== start) {
                    $scope.loadPlans(true).then(function () {
                        $scope.scrollToPlan($scope.plan.maintenance_id);
                    });
                } else {
                    $scope.plan.name = name;
                    handler.plan = $scope.plan;
                }
            });
        }));

    $scope.removeActions = $scope.loader.bind(function (actions) {
        return MaintenanceService.plans.update($scope.plan, {
            delete: map(actions, 'id')
        });
    });

    $scope.silence = $scope.loader.bind(function () {
        $scope.plan.silenced = true;
        Maintenance.silence($scope.plan).then(function () {
            if ($scope.edit.isActive($scope.plan.maintenance_id)) {
                $scope.edit.toggle($scope.plan.maintenance_id);
            }
        });
    });

    $scope.delete = function () {
        sweetAlert({
            text: gettextCatalog.getString(
                'You will not be able to recover this maintenance plan')
        }).then($scope.loader.bind(function () {
            $scope.edit.deactivate($scope.plan.maintenance_id);
            return Maintenance.deletePlan($scope.plan);
        }));
    };

    $scope.showSystemModal = MaintenanceService.showSystemModal;

    $scope.addSystem = new AddActionSelectionHandler($scope);
    $scope.addRule = new AddActionSelectionHandler($scope);

    $scope.systemTableParams = MaintenanceService.systemTableParams;
    $scope.actionTableParams = MaintenanceService.actionTableParams;

    function tryFindItemInPlan (item, systems) {
        if (systems) {
            return find($scope.plan.rules, {id: item.rule_id});
        } else {
            return find($scope.plan.systems, {system_id: item.system_id});
        }
    }

    $scope.tableParams = function (item, systems, newTable) {
        const plannedItem = tryFindItemInPlan(item, systems);
        const actions = (plannedItem) ? plannedItem.actions : [];
        const loader = (newTable) ? $scope.loader : undefined;

        if (systems) {
            return MaintenanceService.systemTableParams(
                plannedItem || item,
                $scope.plan,
                actions,
                loader);
        } else {
            return MaintenanceService.actionTableParams(
                plannedItem || item,
                $scope.plan,
                actions,
                loader);
        }
    };

    $scope.minimize = function () {
        // don't minimize right away because that messes up with the global click handler
        $timeout(function () {
            $scope.error = null;
            $scope.edit.deactivate($scope.plan.maintenance_id);
        });
    };

    $scope.export = function () {
        Maintenance.exportPlan($scope.plan.maintenance_id);
    };

    $scope.downloadPlaybook = function () {
        if ($scope.playbookTab) {
            $scope.playbookTab();
        }

        Maintenance.downloadPlaybook($scope.plan.maintenance_id)
        .then(function (response) {
            if (response.status === 200) {
                const disposition = response.headers('content-disposition');
                const filename = parseHeader(disposition).filename.replace(/"/g, '');
                const blob = new Blob([response.data],
                                      {type: response.headers('content-type')});
                FileSaver.saveAs(blob, filename);
            }
        });
    };

    $scope.dateChanged = function (unused, value, explicit) {
        if (explicit) {
            $scope.editBasic.dateChanged(value);
        }
    };

    $scope.minimize = function () {
        if ($scope.editBasic.active) {
            $scope.editBasic.toggle();
        }

        $scope.error = null;
        $scope.edit.deactivate($scope.plan.maintenance_id);
    };

    $scope.$on('telemetry:esc', function ($event) {
        if ($event.defaultPrevented) {
            return;
        }

        if (swal.isVisible()) {
            return;
        }

        if ($scope.edit.isActive($scope.plan.maintenance_id) &&
            !$scope.editBasic.active) {

            $scope.error = null;
            $scope.edit.deactivate($scope.plan.maintenance_id);
        }
    });

    $scope.update = $scope.loader.bind(function (data) {
        $scope.error = null;
        return Maintenance.updatePlan($scope.plan.maintenance_id, data);
    });

    $scope.hidden = function (value) {
        function cb () {
            var data = {hidden: value};
            if ($scope.plan.suggestion === Maintenance.SUGGESTION.REJECTED) {
                data.suggestion = Maintenance.SUGGESTION.PROPOSED;
            }

            $scope.update(data).then(function () {
                assign($scope.plan, data);
                $rootScope.$broadcast(
                    'maintenance:planChanged', $scope.plan.maintenance_id);
            });
        }

        if (!value) {
            sweetAlert({
                text: gettextCatalog.getString(
                    'You are about to send a plan suggestion to the customer.')
            }).then(cb);
        } else {
            cb();
        }
    };

    $scope.accept = function () {
        var data = {suggestion: Maintenance.SUGGESTION.ACCEPTED};
        $scope.update(data).then(function () {
            assign($scope.plan, data);
            $rootScope.$broadcast('maintenance:planChanged', $scope.plan.maintenance_id);
            $scope.scrollToPlan($scope.plan.maintenance_id);
        });
    };

    $scope.reject = function () {
        var data = {suggestion: Maintenance.SUGGESTION.REJECTED};
        $scope.update(data).then(function () {
            assign($scope.plan, data);
            $scope.plan.hidden = true;
            $rootScope.$broadcast('maintenance:planChanged', $scope.plan.maintenance_id);
            if (!MaintenanceService.plans.suggested.length) {
                $scope.setCategory('unscheduled');
            }
        });
    };

    $scope.isReadOnly = function () {
        return $scope.plan.isReadOnly() && !$scope.isInternal;
    };

    $scope.registerGroupChangeListener = function (uiSelect) {
        const unregister = $rootScope.$on('group:change', function () {
            if (uiSelect.refreshItems) {
                uiSelect.refreshItems();
            }
        });

        $scope.$on('$destroy', unregister);
    };

    $scope.groupBySystemType = function (system) {
        const group = Group.current();

        if (group.display_name !== undefined) {
            if (find(group.systems, {system_id: system.system_id})) {
                return `${CURRENT_GROUP_PREFIX}: ${group.display_name}`;
            }
        }

        // this is safe as system select won't be shown before system types are loaded
        return get(SystemsService.getSystemTypeUnsafe(system.system_type_id),
            'displayName');
    };

    $scope.groupFilter = function (groups) {
        return sortBy(groups, [function (group) {
            return !group.name.startsWith(CURRENT_GROUP_PREFIX);
        }, 'name']);
    };

    function checkAnsibleSupport () {
        $scope.error = null;
        $scope.ansibleSupport = some($scope.plan.actions, 'rule.ansible');
    }

    $scope.$watch('plan.actions', checkAnsibleSupport);

    $scope.playbookTabLoader = new Utils.Loader(false);
    $scope.prepareAnsibleTab = $scope.playbookTabLoader.bind(function () {
        return SystemsService.getSystemTypesAsync().then(function () {
            return Maintenance.getPlayMetadata($scope.plan.maintenance_id);
        }).then(function (res) {
            $scope.plays = res.data;

            $scope.plays.forEach(function (play) {
                play.systemType = SystemsService.getSystemTypeUnsafe(play.system_type_id);
            });
        });
    });

    $scope.setupPlaybookTabActivator = function (value) {
        value.$watch('tabs', function (tabs) {
            if (tabs) {
                $scope.playbookTab = function () {
                    tabs[2].select();
                };
            }
        });
    };

    $scope.resolutionModal = function (play) {
        return MaintenanceService.resolutionModal($scope.plan, play, false)
            .then($scope.prepareAnsibleTab);
    };

    $scope.addActions = function () {
        return MaintenanceService.showMaintenanceModal(null, null, $scope.plan)
            .then($scope.prepareAnsibleTab);
    };

    function deleteHandler (event) {
        if ($scope.edit.isActive($scope.plan.maintenance_id) && event.keyCode === 46) {
            $scope.delete();
        }
    }

    $document.on('keydown', deleteHandler);
    $scope.$on('$destroy', function () {
        $document.off('keydown', deleteHandler);
    });
}

function AddActionSelectionHandler ($scope) {
    var self = this;
    self.reset();
    $scope.$watch('edit.isActive(plan.maintenance_id)', function () {
        self.reset();
    });
}

AddActionSelectionHandler.prototype.reset = function () {
    this.selected = null;
};

function maintenancePlan($document) {

    function isContainedBy($event, className) {
        var elements = $document[0].getElementsByClassName(className);
        for (let i = 0; i < elements.length; i++) {
            if (elements.item(i).contains($event.target)) {
                return true;
            }
        }
    }

    return {
        templateUrl: 'js/components/maintenance/maintenancePlan/maintenancePlan.html',
        restrict: 'E',
        controller: maintenancePlanCtrl,
        replace: true,
        link: function (scope, element) {
            function clickHandler($event) {

                if (scope.editBasic.active) {
                    return; // if edit form is on we ignore clicks outside of the plan
                }

                if (isContainedBy($event, 'modal')) {
                    return;  // clicking on a modal does not retract a plan
                }

                if (isContainedBy($event, 'swal2-container')) {
                    return;  // clicking on a sweet-alert does not retract a plan
                }

                if (isContainedBy($event, 'top-bar')) {
                    return; // clicking on a topbar does not retract a plan
                }

                if ($event.target.classList.contains('action') ||
                    ($event.target.parentElement &&
                    $event.target.parentElement.classList.contains('action'))) {

                    return; // clicking an .action does not cause plan extend/retract
                }

                let planHit = element[0].contains($event.target);
                let bodyHit = $document[0].body.contains($event.target);
                let active = scope.edit.isActive(scope.plan.maintenance_id);

                if (active &&
                    $document[0].getElementsByClassName('ui-select-choices-row').length) {

                    // ui-select is open -
                    // this click retracts ui-select-choices, not the entire plan
                    return;
                }

                if ((active && !planHit && bodyHit) || (!active && planHit)) {
                    scope.edit.toggle(scope.plan.maintenance_id);
                }
            }

            $document.on('click', clickHandler);
            scope.$on('$destroy', function () {
                $document.off('click', clickHandler);
            });
        }
    };
}

componentsModule.directive('maintenancePlan', maintenancePlan);
