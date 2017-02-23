/*global require*/
'use strict';

const componentsModule = require('../../');
const find = require('lodash/collection/find');
const indexBy = require('lodash/collection/indexBy');
const map = require('lodash/collection/map');
const flatten = require('lodash/array/flatten');
const groupBy = require('lodash/collection/groupBy');

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
                              DataUtils) {
    $scope.MODES = MODES;
    $scope.tableEdit = true;

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
    $scope.newPlan = true;
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
            if ($scope.selected.plan && $scope.selected.plan.systems) {
                item = find($scope.selected.plan.systems,
                    {system_id: system.system_id}) || item;
            }

            params = MaintenanceService.actionTableParams(
                item, $scope.getPlan(), item.actions, $scope.loader);

            // preselect all actions that are not planned in another plan
            preselectAvailableActions(params, function (action) {
                return action._type !==
                    MaintenanceService.MAINTENANCE_ACTION_TYPE.PLANNED_ELSEWHERE;
            });
        } else if ($scope.mode === MODES.rule) {

            // if the rule is part of the plan already, use that object
            let item = rule;
            if ($scope.selected.plan && $scope.selected.plan.rules) {
                item = find($scope.selected.plan.rules, {id: rule.rule_id}) || item;
            }

            params = MaintenanceService.systemTableParams(
                item, $scope.getPlan(), item.actions, $scope.loader);

            // select previously selected systems in the planner table
            let selectedSystemsById = indexBy(systems, 'system_id');

            // preselect actions previously selected by the user on Actions page 3
            preselectAvailableActions(params, function (action) {
                return action.id in selectedSystemsById;
            });
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

    $scope.$watch('plans.all', function (value) {
        if (value) {
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
