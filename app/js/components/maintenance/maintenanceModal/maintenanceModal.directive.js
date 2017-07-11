/*global require*/
'use strict';

const componentsModule = require('../../');
const find = require('lodash/find');
const indexBy = require('lodash/keyBy');
const map = require('lodash/map');
const flatMap = require('lodash/flatMap');
const constant = require('lodash/constant');
const sortBy = require('lodash/sortBy');

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
                              existingPlan,
                              Subset,
                              Rule,
                              Group) {
    $scope.MODES = MODES;
    $scope.tableEdit = true;
    $scope.selected = {};
    $scope.plans = MaintenanceService.plans;
    $scope.loader = new Utils.Loader();
    $scope.loadingSystems = false;
    $scope.rule = rule;
    $scope.systems = systems;
    $scope.Group = Group;

    if (angular.isObject(existingPlan)) {
        $scope.newPlan = false;
        MaintenanceService.plans.load().then(function () {
            $scope.selected.plan = find(MaintenanceService.plans.all,
                {maintenance_id: existingPlan.maintenance_id});
        });
    } else if (existingPlan === true) {
        $scope.newPlan = false;
    } else {
        $scope.newPlan = true;
    }

    if (systems && systems.length === 1) {
        $scope.selected.system = systems[0];
    }

    // normalize - if multiselect contains only one system treat as simple case
    if (!rule && systems) {
        if (systems.length === 1) {
            systems = false;
            $scope.mode = MODES.system;
        } else {
            $scope.mode = MODES.multi;
            $scope.systemSelection = 'preselected';
        }
    } else if (rule && systems) {
        $scope.mode = MODES.rule;
        $scope.systemSelection = 'preselected';
    } else if (!rule && !systems) {
        $scope.mode = MODES.multi;

        if (Group.groups.length) {
            $scope.systemSelection = 'group';
        } else {
            $scope.systemSelection = 'all';
        }

    } else {
        throw new Error(`Invalid parameters ${rule}, ${systems}`);
    }

    if (Group.groups.length) {
        if (Group.current().id) {
            $scope.systemSelection = 'group';
            $scope.selected.group = Group.current();
        } else {
            $scope.selected.group = sortBy(Group.groups, ['display_name', 'id'])[0];
        }
    }

    $scope.getPlan = function () {
        if (!$scope.newPlan && $scope.selected.plan) {
            return $scope.selected.plan;
        }

        return {};
    };

    function rebuildTable () {
        $scope.plan = ($scope.newPlan) ? {} : $scope.selected.plan;

        if ($scope.mode === MODES.multi) {
            $scope.tableParams = buildMultiTableParams();
        } else {
            $scope.tableParams = buildTableParams();
        }

        $scope.$broadcast('maintenance:reload-table');
    }

    $scope.$watchGroup(['selected.plan', 'newPlan', 'selected.group', 'selected.system'],
        rebuildTable);

    $scope.systemSelectionChanged = function (selection) {
        $scope.systemSelection = selection;

        if (selection === 'system') {
            $scope.mode = MODES.system;
            $scope.tableParams = null;

            if ($scope.selected.system) {
                rebuildTable();
            }

            return;
        }

        $scope.mode = MODES.multi;
        rebuildTable();
    };

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
        $scope.noActions = false;
        let params = null;

        if ($scope.mode === MODES.system) {

            // if the system is part of the plan already, use that object
            let item = $scope.selected.system;
            if (!$scope.newPlan && $scope.selected.plan && $scope.selected.plan.systems) {
                item = find($scope.selected.plan.systems,
                    {system_id: item.system_id}) || item;
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
                add: toAdd
            }).then(function (plan) {
                $scope.selected.plan = plan;
                return plan;
            });
        };

        return params;
    }

    function buildMultiTableParams () {
        const availableActions = getAvailableActionsForMultiTable();

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
                // cartesian product of selected systems and rules
                // the API is clever enough to filter out combinations with no reports
                const add = flatMap(toAdd, function (rule) {
                    if (rule.systemIds) {
                        return map(rule.systemIds, function (system_id) {
                            return {
                                system_id,
                                rule_id: rule.rule.rule_id
                            };
                        });
                    } else if (rule.groupId) {
                        return [{
                            group_id: rule.groupId,
                            rule_id: rule.rule.rule_id
                        }];
                    } else {
                        return [{
                            rule_id: rule.rule.rule_id
                        }];
                    }
                });

                const payload = {
                    name: $scope.newPlanAlias,
                    add
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

    function getAvailableActionsForMultiTable () {
        if ($scope.systemSelection === 'preselected') {
            $scope.fixableSystems = $scope.systems.filter(function (system) {
                return system.report_count > 0;
            });

            const systemIds = map($scope.fixableSystems, 'system_id');

            // if this is ever used in Satellite it should send the real branch_id instead
            // of null here
            return getActionsForSystems(systemIds);
        } else if ($scope.systemSelection === 'all') {
            return Rule.getRulesWithHits().then(function (res) {
                $scope.noActions = res.data.resources.length === 0;
                return map(res.data.resources, ruleToActionMapper());
            });
        } else if ($scope.systemSelection === 'group') {
            if (!$scope.selected.group || !$scope.selected.group.id) {
                throw new Error('No group selected'); // should never happen
            }

            return Rule.getRulesWithHits($scope.selected.group.id).then(function (res) {
                $scope.noActions = res.data.resources.length === 0;
                return map(res.data.resources,
                    ruleToActionMapper(null, $scope.selected.group.id));
            });
        } else {
            throw new Error(
                `Unexpected systemSelection value: ${$scope.systemSelection}`);
        }
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
        return sortBy(groups, ['items.length']);
    };

    $scope.getPlanName = function (plan) {
        if (plan.name && plan.name.length) {
            return plan.name;
        }

        return gettextCatalog.getString('Unnamed plan');
    };

    function ruleToActionMapper (systemIds, groupId) {
        return function (rule) {
            const value = {
                id: rule.rule_id,
                display: rule.description,
                mid: rule.rule_id,
                rule: rule,
                done: false
            };

            if (systemIds) {
                value.systemIds = systemIds;
            }

            if (groupId) {
                value.groupId = groupId;
            }

            return value;
        };
    }

    function getActionsForSystems (systemIds) {
        if (systemIds.length === 0) {
            $scope.noActions = true;
            return $q.resolve([]);
        }

        return Subset.create(null, systemIds).then(function (res) {
            return Subset.getRulesWithHits(res.data.hash).then(function (res) {
                $scope.noActions = res.data.resources.length === 0;
                return map(res.data.resources, ruleToActionMapper(systemIds));
            });
        });
    }

    $scope.searchSystems = function (value) {
        const params = {
            page_size: 30,
            page: 0,
            report_count: 'gt0'
        };

        if (value && value.length) {
            params.search_term = value;
        }

        const key = String(value);
        $scope.loadingSystems = key;
        return System.getSystemsLatest(params).then(function (res) {
            $scope.availableSystems = res.data.resources;
        }).finally(function () {
            if ($scope.loadingSystems === key) {
                $scope.loadingSystems = false;
            }
        });
    };

    $scope.searchSystems().then(function () {
        if ($scope.availableSystems.length) {
            $scope.selected.system =
                sortBy($scope.availableSystems, ['toString', 'system_id'])[0];
        }
    });

    MaintenanceService.plans.load(false);
    ModalUtils.suppressEscNavigation($modalInstance);
}

function maintenanceModal() {
    return {
        templateUrl: 'js/components/maintenance/' +
                     'maintenanceModal/maintenanceModal.html',
        restrict: 'E',
        controller: maintenanceModalCtrl,
        replace: false
    };
}

componentsModule.directive('maintenanceModal', maintenanceModal);
componentsModule.controller('maintenanceModalCtrl', maintenanceModalCtrl);
