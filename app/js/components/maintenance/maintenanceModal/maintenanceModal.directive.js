/*global require*/
'use strict';

const componentsModule = require('../../');
const find = require('lodash/collection/find');
const indexBy = require('lodash/collection/indexBy');
const map = require('lodash/collection/map');
const flatten = require('lodash/array/flatten');
const groupBy = require('lodash/collection/groupBy');
const constant = require('lodash/utility/constant');

const MODES = {
    rule: 'rule',
    system: 'system',
    multi: 'multi'
};

/**
 * @ngInject
 */
function maintenanceModalCtrl($scope,
                              $rootScope,
                              $modalInstance,
                              system,
                              rule,
                              systems,
                              MaintenanceService,
                              System,
                              Utils,
                              $state,
                              gettextCatalog,
                              ModalUtils,
                              $q,
                              DataUtils,
                              newPlan) {
    $scope.MODES = MODES;
    $scope.tableEdit = true;
    $scope.newPlan = newPlan;

    // normalize - if multiselect contains only one system treat as simple case
    if (!rule && systems) {
        if (systems.length === 1) {
            system = systems[0];
            systems = false;
            $scope.mode = MODES.system;
        } else {
            $scope.mode = MODES.multi;
        }
    } else if (rule && systems) {
        $scope.mode = MODES.rule;
    } else if (system) {
        $scope.mode = MODES.system;
    } else {
        throw new Error(`Invalid parameters ${system}, ${rule}, ${systems}`);
    }

    $scope.plans = MaintenanceService.plans;
    $scope.system = system;
    $scope.loader = new Utils.Loader();
    $scope.selected = {};
    $scope.rule = rule;
    $scope.systems = systems;

    $scope.getPlan = function () {
        if (!$scope.newPlan && $scope.selected.plan) {
            return $scope.selected.plan;
        }

        return {};
    };

    $scope.$watchGroup(['selected.plan', 'newPlan'], function () {
        $scope.plan = ($scope.newPlan) ? {} : $scope.selected.plan;

        if (systems && !rule) {
            $scope.tableParams = buildMultiTableParams();
        } else {
            $scope.tableParams = buildTableParams();
        }
    });

    function preselectAvailableActions (params, fn) {
        const overriden = params.getAvailableActions;
        params.getAvailableActions = function () {
            return overriden.call(params).then(function (available) {
                available.forEach(function (action) {
                    action.selected = fn(action);
                });

                return available;
            });
        };
    }

    function buildTableParams () {
        let params = null;

        if ($scope.mode === MODES.system) {

            // if the system is part of the plan already, use that object
            let item = system;
            if (!$scope.newPlan && $scope.selected.plan && $scope.selected.plan.systems) {
                item = find($scope.selected.plan.systems,
                    {system_id: system.system_id}) || item;
            }

            params = MaintenanceService.actionTableParams(
                item, $scope.getPlan(), item.actions, $scope.loader);

            if (rule) { // preselect the given rule if any
                preselectAvailableActions(params, function (action) {
                    return action.rule.rule_id === rule.rule_id;
                });
            }
        } else if ($scope.mode === MODES.rule) {

            // if the rule is part of the plan already, use that object
            let item = rule;
            if (!$scope.newPlan && $scope.selected.plan && $scope.selected.plan.rules) {
                item = find($scope.selected.plan.rules, {id: rule.rule_id}) || item;
            }

            params = MaintenanceService.systemTableParams(
                item, $scope.getPlan(), item.actions, $scope.loader);

            // index selected systems by their ID
            let selectedSystemsById = indexBy(systems, 'system_id');

            // only display available systems selected on the previous screen
            // TODO: we can eliminate this altogether once we switch to creating plan
            // actions from (system_id, rule_id) as opposed to report.id
            const overriden = params.getAvailableActions;
            params.getAvailableActions = function () {
                return overriden.call(params).then(function (available) {
                    return available.filter(function (action) {
                        return action.system.system_id in selectedSystemsById;
                    });
                });
            };

            // and preselect them all
            preselectAvailableActions(params, constant(true));

            // suppress actions already in plan
            params.getActions = constant([]);
        }

        // if this is a new plan then we need to create it on-save
        // instead of updating existing plan
        let update = params.update;
        params.update = function (toAdd) {
            if ($scope.selected.plan && !$scope.newPlan) {
                return update.call(params, toAdd);
            }

            return MaintenanceService.plans.create({
                name: $scope.newPlanAlias,
                reports: toAdd
            }).then(function (plan) {
                $scope.selected.plan = plan;
                return plan;
            });
        };

        return params;
    }

    function buildMultiTableParams () {
        const promises = [];
        $scope.fixableSystems = $scope.systems.filter(function (system) {
            if (system.report_count > 0) {
                promises.push(System.getSystemReports(system.system_id));
                return true;
            } else {
                return false;
            }
        });

        const availableActions = $q.all(promises).then(function (responses) {
            const reports = flatten(map(responses, 'data.reports'));
            reports.forEach(report => DataUtils.readRule(report.rule)); // severityNum
            const reportsByRuleId = groupBy(reports, 'rule_id');

            return Object.keys(reportsByRuleId).map(function (ruleId) {
                const reports = reportsByRuleId[ruleId];
                const rule = reports[0].rule;
                return {
                    id: ruleId,
                    display: rule.description,
                    mid: ruleId,
                    rule: rule,
                    done: false,
                    reports: reports
                };
            });
        });

        return {
            getActions: function () {
                return [];
            },

            getAvailableActions: function () {
                return availableActions;
            },

            implicitOrder: {
                predicate: 'rule.severityNum',
                reverse: true
            },

            save: function (toAdd) {
                const payload = {
                    name: $scope.newPlanAlias,
                    reports: map(flatten(map(toAdd, 'reports')), 'id')
                };
                if (!$scope.newPlan && $scope.selected.plan) {
                    return MaintenanceService.plans.update(
                        $scope.selected.plan, payload);
                }

                return MaintenanceService.plans.create(payload).then(function (plan) {
                    $scope.selected.plan = plan;
                    return plan;
                });
            }
        };
    }

    $scope.close = function () {
        $modalInstance.dismiss('close');
    };

    $scope.postSave = function () {
        $scope.close();
        $state.go('app.maintenance', {
            maintenance_id: $scope.selected.plan.maintenance_id
        });
    };

    $scope.$watch('plans.all', function () {
        if (MaintenanceService.plans.future) {
            $scope.availablePlans = MaintenanceService.plans.future.concat(
                MaintenanceService.plans.unscheduled);

            if (!$scope.selected.plan && $scope.availablePlans.length) {
                $scope.selected.plan = $scope.availablePlans[0];
            }
        }
    });

    $scope.planGroupFn = function (plan) {
        if (plan.start) {
            return gettextCatalog.getString('Future plans');
        } else {
            return gettextCatalog.getString('Not scheduled plans');
        }
    };

    $scope.planOrderFn = function (groups) {
        groups.sort(function (a, b) {
            // "create new plan" should be first
            if (!a.name) {
                return -1;
            }

            if (!b.name) {
                return 1;
            }

            return a.items.length - b.items.length;
        });

        return groups;
    };

    $scope.getPlanName = function (plan) {
        if (plan.name && plan.name.length) {
            return plan.name;
        }

        return gettextCatalog.getString('Untitled plan');
    };

    MaintenanceService.plans.load(false);
    ModalUtils.suppressEscNavigation($modalInstance);
}

function maintenanceModal() {
    return {
        templateUrl: 'js/components/maintenance/' +
                     'maintenanceModal/maintenanceModal.html',
        restrict: 'E',
        controller: maintenanceModalCtrl,
        replace: true
    };
}

componentsModule.directive('maintenanceModal', maintenanceModal);
componentsModule.controller('maintenanceModalCtrl', maintenanceModalCtrl);
