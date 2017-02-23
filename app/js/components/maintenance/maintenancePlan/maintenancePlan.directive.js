'use strict';

var componentsModule = require('../../');
var assign = require('lodash/object/assign');
var map = require('lodash/collection/map');
const find = require('lodash/collection/find');
const FileSaver = require('file-saver');
const parseHeader = require('parse-http-header');
const some = require('lodash/collection/some');

/**
 * @ngInject
 */
function maintenancePlanCtrl(
    $modal,
    $rootScope,
    $scope,
    $timeout,
    gettextCatalog,
    AnsibleAPIErrors,
    AnsibleErrors,
    DataUtils,
    Maintenance,
    MaintenanceService,
    SweetAlert,
    SystemsService,
    Utils) {

    $scope.pager = new Utils.Pager(10);
    $scope.loader = new Utils.Loader();
    $scope.exportPlan = Maintenance.exportPlan;
    $scope.error = null;

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
        SweetAlert.swal({
            title: gettextCatalog.getString('Are you sure?'),
            text: gettextCatalog.getString(
                'You will not be able to recover this maintenance plan'),
            type: 'warning',
            html: true,
            confirmButtonColor: '#DD6B55',
            confirmButtonText: 'Yes',
            showCancelButton: true
        }, $scope.loader.bind(function (isConfirm) {
            if (isConfirm) {
                $scope.edit.deactivate($scope.plan.maintenance_id);
                return Maintenance.deletePlan($scope.plan);
            }
        }));
    };

    $scope.showSystemModal = MaintenanceService.showSystemModal;

    $scope.addSystem = new AddActionSelectionHandler($scope);
    $scope.addRule = new AddActionSelectionHandler($scope);

    $scope.systemTableParams = MaintenanceService.systemTableParams;
    $scope.actionTableParams = MaintenanceService.actionTableParams;

    //filter out rules that are already completely part of the current plan
    $scope.getAvailableRules = function () {
        //loop over each $scope.available.rule
        //count actions on maintenancePlan with rule_id=available.rule_id and !done
        //if plan.count >= available.count then hide the rule
        return $scope.available.rules.filter(function (rule) {
            const availableCount = rule.report_count;
            const plannedRules = $scope.plan.actions.filter(function (action) {
                return (!action.done && action.rule && action.rule.id === rule.rule_id);
            });

            return (plannedRules.length < availableCount);
        });
    };

    //filter out systems that are already completely part of the current plan
    $scope.getAvailableSystems = function () {
        return $scope.available.systems.filter(function (system) {
            const availableCount = system.report_count;
            const plannedSystems = $scope.plan.actions.filter(function (action) {
                return (action.system && action.system.system_id === system.system_id);
            });

            return (plannedSystems.length < availableCount);
        });
    };

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

    function openPlaybookModal(questions, unsupportedRules) {
        $modal.open({
            templateUrl:
                'js/components/maintenance/maintenancePlaybook/maintenancePlaybook.html',
            windowClass: 'modal-playbook modal-wizard ng-animate-enabled',
            backdropClass: 'system-backdrop ng-animate-enabled',
            controller: 'MaintenancePlaybook',
            resolve: {
                plan: function () {
                    return $scope.plan;
                },

                questions: function () {
                    return questions;
                },

                unsupportedRules: function () {
                    return unsupportedRules;
                }
            }
        });
    }

    $scope.generatePlaybook = function () {
        Maintenance.generatePlaybook($scope.plan.maintenance_id)
        .then(function generatedPlaybook(response) {
            if (response.status === 200) {
                const disposition = response.headers('content-disposition');
                const filename = parseHeader(disposition).filename.replace(/"/g, '');
                const blob = new Blob([response.data],
                                      {type: response.headers('content-type')});
                FileSaver.saveAs(blob, filename);
            }
        },

        function handlePlaybookError (resp) {
            if (resp.status === 400) {
                if (resp.data.error.key === AnsibleAPIErrors.AmbiguousResolution) {
                    openPlaybookModal(resp.data.error.details, null);
                } else if (resp.data.error.key === AnsibleAPIErrors.UnsupportedRule) {
                    openPlaybookModal(null, resp.data.error.details);
                } else if (
                    resp.data.error.key === AnsibleAPIErrors.MaintenanceNothingToFix ||
                    resp.data.error.key === AnsibleAPIErrors.MaintenanceEmpty) {
                    $scope.error = AnsibleErrors.NoActions;
                } else {
                    $scope.error = AnsibleErrors.GeneralFailure;
                }
            } else {
                $scope.error = AnsibleErrors.GeneralFailure;
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
            SweetAlert.swal({
                title: gettextCatalog.getString('Are you sure?'),
                text: gettextCatalog.getString(
                    'You are about to send a plan suggestion to the customer.'),
                type: 'warning',
                html: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: 'Yes',
                showCancelButton: true
            }, function (isConfirm) {
                if (isConfirm) {
                    cb();
                }
            });
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

    $scope.groupBySystemType = function (system) {
        return SystemsService.getSystemTypeDisplayName(system.system_type_id);
    };

    function checkAnsibleSupport () {
        $scope.error = null;
        $scope.ansibleSupport = some($scope.plan.actions, 'rule.ansible');
    }

    $scope.$watch('plan.actions', checkAnsibleSupport);
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

                if (isContainedBy($event, 'sweet-alert')) {
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
