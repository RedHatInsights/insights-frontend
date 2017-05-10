'use strict';

const servicesModule = require('./');
const filter = require('lodash/filter');
const map = require('lodash/map');
const flatMap = require('lodash/flatMap');
const indexBy = require('lodash/keyBy');
const reject = require('lodash/reject');
const remove = require('lodash/remove');
const some = require('lodash/some');
const assign = require('lodash/assign');
const pick = require('lodash/pick');

/**
 * @ngInject
 */
function MaintenanceService(
    Utils,
    Severities,
    Report,
    $rootScope,
    Rule,
    System,
    InsightsConfig,
    $modal,
    Maintenance,
    User,
    $q,
    DataUtils,
    TopbarAlertsService,
    $state,
    gettextCatalog) {

    var service = {
        available: {
            systems: [],
            rules: []
        }
    };
    var plansDfd = false;

    var MAINTENANCE_ACTION_TYPE = Object.freeze({
        PLANNED: 0,
        AVAILABLE: 1,
        PLANNED_ELSEWHERE: 2
    });
    service.MAINTENANCE_ACTION_TYPE = MAINTENANCE_ACTION_TYPE;

    function getPlannedActionsReportIds () {
        var now = new Date();
        var plans = filter(service.plans.all, function (plan) {
            // only show planning conflict with real plans, not suggestions and past plans
            return (plan.suggestion === null ||
                plan.suggestion === Maintenance.SUGGESTION.ACCEPTED) &&
                (!plan.end || plan.end > now);
        });

        return indexBy(reject(flatMap(plans, 'actions'), 'done'),
            'current_report.id');
    }

    service.loadAvailableSystemsAndRules = function () {
        const systemsPromise = processSystems();
        const rulesPromise = processRules();
        return $q.all([systemsPromise, rulesPromise]);
    };

    function processSystems() {
        return System.getSystemsLatest({report_count: 'gt0'}).then(function (response) {
            const systems = response.data.resources;
            systems.forEach(function (system) {
                DataUtils.readSystem(system);

                //TODO: do we need to alias these attributes?
                Utils.alias('system_id', '_id')(system);
                Utils.alias('_name', '_displayAs')(system);

                // we use this in the view to distinguish between systems and groups
                system._type = 'systems';
            });

            service.available.systems = systems;
        });
    }

    function processRules() {
        Rule.getRulesLatest({report_count: 'gt0'}).then(function (response) {
            const rules = response.data.resources;
            rules.forEach(function (rule) {
                DataUtils.readRule(rule);
            });

            const alias = Utils.alias('description', '_displayAs');
            rules.forEach(function (rule) {
                alias(rule);
            });

            service.available.rules = rules;
        });
    }

    service.showSystemModal = function (s, rule) {
        if (rule) {
            rule = rule.rule_id;
        }

        System.getSystemReports(s.system_id).success(function (system) {
            if (typeof InsightsConfig.actionsShowSystem === 'function') {
                return InsightsConfig.actionsShowSystem(system, rule);
            }

            $modal.open({
                templateUrl: 'js/components/system/systemModal/systemModal.html',
                windowClass: 'system-modal ng-animate-enabled',
                backdropClass: 'system-backdrop ng-animate-enabled',
                controller: 'SystemModalCtrl',
                resolve: {
                    system: function () {
                        return system;
                    },

                    rule: function () {
                        return rule;
                    }
                }
            });
        });
    };

    service.showMaintenanceModal = function (systems, rule, existingPlan) {
        $modal.open({
            templateUrl: 'js/components/maintenance/' +
            'maintenanceModal/maintenanceModal.html',
            windowClass: 'maintenance-modal modal-wizard ng-animate-enabled',
            backdropClass: 'system-backdrop ng-animate-enabled',
            controller: 'maintenanceModalCtrl',
            resolve: {
                systems: function () {
                    return systems || false;
                },

                rule: function () {
                    return rule || false;
                },

                existingPlan: function () {
                    return existingPlan;
                }
            }
        });
    };

    function TableParams (plan, item, savedActions, loader) {
        this.plan = plan;
        this.item = item;
        this.savedActions = savedActions || [];
        this.loader = loader;
        this.implicitOrder = {
            predicate: 'display',
            reverse: false
        };
    }

    TableParams.prototype.getActions = function () {
        return this.savedActions.map(this.actionMapper);
    };

    TableParams.prototype.update = function (toAdd, toRemove) {
        return service.plans.update(this.plan, {
            add: toAdd,
            delete: toRemove
        });
    };

    TableParams.prototype.save = function (toAdd, toRemove) {
        return this.update(
            map(toAdd, item => pick(item, ['rule_id', 'system_id'])),
            map(toRemove, 'mid'));
    };

    service.systemTableParams = function (rule, plan, actions, loader) {
        const params = new TableParams(plan, rule, actions, loader);

        params.actionMapper = function (action) {
            return {
                id: action.system.system_id,
                display: action.system._name,
                mid: action.id,
                system: action.system,
                done: action.done,
                systemTypeIconId: action.system.system_type_id
            };
        };

        params.getAvailableActions = function () {
            const query = {
                rule: rule.rule_id,
                expand: 'system'
            };

            return Report.getReportsLatest(query).then(function (response) {
                const plannedActions = getPlannedActionsReportIds();
                const reports = response.data.resources;
                let planItems = [];

                reports.forEach(function forEachReport(report) {
                    report.system = DataUtils.readSystem(report.system);
                    planItems.push({
                        id: report.system.system_id,
                        display: report.system._name,
                        system: report.system,
                        done: false,
                        system_id: report.system.system_id,
                        rule_id: rule.rule_id,
                        _type: (report.id in plannedActions) ?
                            MAINTENANCE_ACTION_TYPE.PLANNED_ELSEWHERE :
                            MAINTENANCE_ACTION_TYPE.AVAILABLE,
                        systemTypeIconId: report.system.system_type_id
                    });
                });

                return planItems;
            });
        };

        return params;
    };

    service.actionTableParams = function (system, plan, actions, loader) {
        var params = new TableParams(plan, system, actions, loader);

        params.actionMapper = function (action) {
            return {
                id: action.rule.rule_id,
                display: action.rule.description,
                mid: action.id,
                rule: action.rule,
                done: action.done
            };
        };

        params.getAvailableActions = function () {
            return System.getSystemReports(system.system_id).then(function (response) {
                const plannedActions = getPlannedActionsReportIds();
                const reports = response.data.reports;
                let planItems = [];

                reports.forEach(function forEachReport(report) {
                    planItems.push({
                        id: report.rule.rule_id,
                        display: report.rule.description,
                        rule: report.rule,
                        done: false,
                        system_id: system.system_id,
                        rule_id: report.rule.rule_id,
                        _type: (report.id in plannedActions) ?
                            MAINTENANCE_ACTION_TYPE.PLANNED_ELSEWHERE :
                            MAINTENANCE_ACTION_TYPE.AVAILABLE
                    });
                });

                return planItems;
            });
        };

        params.implicitOrder = {
            predicate: 'rule.severityNum',
            reverse: true
        };

        return params;
    };

    service.plans = {
        all: []
    };
    service.plans.load = function (force) {
        if (force || !plansDfd) {
            plansDfd = Maintenance.getMaintenancePlans().then(function (plans) {
                service.plans.all = plans;
                return service.plans.process();
            });
        }

        return plansDfd;
    };

    service.plans.process = function () {
        var now = new Date();
        return User.init().then(function (user) {
            var isInternal = user.is_internal;
            service.plans.future = [];
            service.plans.past = [];
            service.plans.overdue = [];
            service.plans.unscheduled = [];
            service.plans.suggested = [];
            service.plans.all.forEach(function (plan) {
                // filter out hidden plans
                // TODO: this is what backend is supposed to do
                if (plan.hidden && !isInternal) {
                    return;
                }

                if (plan.suggestion === Maintenance.SUGGESTION.PROPOSED ||
                    plan.suggestion === Maintenance.SUGGESTION.REJECTED) {

                    service.plans.suggested.push(plan);
                } else if (plan.end) {
                    if (plan.end > now) {
                        service.plans.future.push(plan);
                    } else {
                        service.plans.past.push(plan);
                        if (plan.overdue && !plan.silenced) {
                            service.plans.overdue.push(plan);
                        }
                    }
                } else {
                    service.plans.unscheduled.push(plan);
                }
            });

            // update topbar alerts
            TopbarAlertsService.removeAll('maintenance');
            if (service.plans.overdue.length) {
                TopbarAlertsService.push({
                    type: 'maintenance',
                    msg: gettextCatalog.getPlural(service.plans.overdue.length,
                        'A plan was not completed on time',
                        '{{$count}} plans were not completed on time',
                        {}),
                    acked: false,
                    icon: 'fa-calendar-times-o red',
                    onSelect: function () {
                        $state.go('app.maintenance', {
                            maintenance_id: service.plans.overdue[0].maintenance_id
                        });
                    },

                    onAck: function () {
                        const pending = service.plans.overdue.map(function (plan) {
                            return Maintenance.silence(plan).then(function () {
                                plan.silenced = true;
                            });
                        });

                        $q.all(pending).then(function () {
                            service.plans.process();
                        });
                    }
                });
            }

            const suggested = service.plans.suggested.filter(plan => !plan.hidden);
            if (suggested.length) {
                TopbarAlertsService.push({
                    type: 'maintenance',
                    msg: gettextCatalog.getPlural(suggested.length,
                        'You have a new plan suggestion',
                        'You have {{$count}} new plan suggestions',
                        {}),
                    acked: false,
                    icon: 'fa-wrench',
                    onSelect: function () {
                        $state.go('app.maintenance', {
                            maintenance_id: suggested[0].maintenance_id
                        });
                    }
                });
            }
        });
    };

    service.plans.findCategory = function (id) {
        var options = ['future', 'unscheduled', 'past', 'suggested'];
        function someCallback(item) {
            return item.maintenance_id == id; // jshint ignore:line
        }

        for (let i = 0; i < options.length; i++) {
            if (some(service.plans[options[i]], someCallback)) {
                return options[i];
            }
        }
    };

    service.plans.remove = function (id) {
        remove(service.plans.all, function (item) {
            return item.maintenance_id === id;
        });

        return service.plans.process();
    };

    service.plans.add = function (plan) {
        service.plans.all.push(plan);
        return service.plans.process();
    };

    service.plans.create = function (payload) {
        return Maintenance.createPlan(payload).then(function (res) {
            return Maintenance.getMaintenancePlan(res.data.id).then(function (res) {
                return service.plans.add(res.data).then(function () {
                    return res.data;
                });
            });
        });
    };

    service.plans.update = function (plan, payload) {
        return Maintenance.updatePlan(plan.maintenance_id, payload).then(function () {
            return Maintenance.getMaintenancePlan(plan.maintenance_id)
                .then(function (res) {
                    assign(plan, res.data);
                    return plan;
                });
        });
    };

    service.getPlanName = function (plan) {
        if (!plan.name || !plan.name.length) {
            return `${gettextCatalog.getString('Unnamed plan')} (${plan.maintenance_id})`;
        }

        return plan.name;
    };

    $rootScope.$on('maintenance:planChanged', function () {
        service.plans.process();
    });

    $rootScope.$on('maintenance:planDeleted', function (event, id) {
        service.plans.remove(id);
    });

    return service;
}

servicesModule.service('MaintenanceService', MaintenanceService);
