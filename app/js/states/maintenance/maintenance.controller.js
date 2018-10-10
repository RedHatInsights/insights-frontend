'use strict';

var statesModule = require('../');
var groupBy = require('lodash/groupBy');
var sortBy = require('lodash/sortBy');
var values = require('lodash/values');
var moment = require('moment-timezone');
var CATEGORY_PREFERENCE_KEY = 'maintenance_plan_category';

const DEFAULT_CATEGORY = 'all';

// tracks which plans are expanded into the edit mode
// This handles the mode activated by the first click on a plan.
function EditToggleHandler ($state, $stateParams) {
    this.items = {};
    this.$state = $state;
    this.$stateParams = $stateParams;
}

EditToggleHandler.prototype.isActive = function (id) {
    return id in this.items;
};

EditToggleHandler.prototype.toggle = function (id) {
    if (this.isActive(id)) {
        this.deactivate(id);
    } else {
        this.activate(id);
    }
};

EditToggleHandler.prototype.reset = function () {
    this.items = {};
    this.transition();
};

EditToggleHandler.prototype.activate = function (id) {
    this.items = {};
    this.items[id] = true;
    this.updateUrl();
};

EditToggleHandler.prototype.deactivate = function (id) {
    delete this.items[id];
    this.updateUrl();
};

EditToggleHandler.prototype.updateUrl = function () {
    var keys = Object.keys(this.items);

    // if a single plan is open, make it bookmarkable
    if (keys.length === 1) {
        this.transition(keys[0]);
    } else {
        this.transition();
    }
};

EditToggleHandler.prototype.transition = function (id) {
    const tab = (id) ? this.$stateParams.tab : undefined;

    this.$state.transitionTo(this.$state.current, {
        maintenance_id: id,
        tab
    }, {
        notify: false,
        reload: false,
        location: 'replace'
    });
};

/**
 * @ngInject
 */
function MaintenanceCtrl(
    $document,
    $location,
    $scope,
    $timeout,
    Maintenance,
    Utils,
    $stateParams,
    MaintenanceService,
    $filter,
    PreferenceService,
    PermalinkService,
    $state,
    $rootScope,
    SystemsService,
    Events,
    sweetAlert) {

    $scope.isDefined = angular.isDefined;
    $scope.loader = new Utils.Loader();
    $scope.MaintenanceService = MaintenanceService;

    // used in calendars for highlighting days on which maintenance is already scheduled
    $scope.calendarDates = [];
    $scope.refreshCalendar = function () {
        $scope.calendarDates = MaintenanceService.plans.all
                .filter(function (plan) {
                    return angular.isDefined(plan.start);
                })
                .map(function (plan) {
                    return moment(plan.start);
                });
    };

    $scope.plans = MaintenanceService.plans;
    $scope.edit =
        new EditToggleHandler($state, $stateParams);

    $scope.loadPlans = $scope.loader.bind(function (force) {
        return MaintenanceService.plans.load(force).then(function () {
            if (Object.keys($scope.edit.items).length === 1) {
                let id = Object.keys($scope.edit.items)[0];
                $scope.scrollToPlan(id);
            }
        });
    });

    $scope.scrollToPlan = function (id) {
        if ($scope.category !== 'all') {
            $scope.setCategory('all');
        }

        $timeout(function () {
            $scope.edit.activate(id);
            $rootScope.$broadcast(Events.planner.openPlan, id);
            PermalinkService.scroll('maintenance-plan-' + id, 50);
        });
    };

    $scope.redrawPlans = function () {
        let category = $scope.category || DEFAULT_CATEGORY;
        let plans = MaintenanceService.plans[category];

        if ($scope.category === 'future' || $scope.category === 'past') {
            // group by year/month then transform into array of arrays for ordering
            plans = sortBy(plans, 'start');
            let groupedPlans = values(groupBy(plans, function (plan) {
                var start = moment(plan.start);
                return start.year() + '-' + start.month();
            }));

            if (category === 'past') {
                // show past plans in chronologically descending order
                groupedPlans.reverse();
            }

            $scope.shownPlansByMonth = groupedPlans;
        } else {
            plans = sortBy(plans, 'maintenance_id');
        }

        $scope.shownPlans = plans;
    };

    $scope.category = $location.search().maintenanceCategory ||
                      PreferenceService.get(CATEGORY_PREFERENCE_KEY) ||
                      DEFAULT_CATEGORY;

    if ($stateParams.maintenance_id) {
        let id = parseInt($stateParams.maintenance_id);
        if (!isNaN(id)) {
            $scope.edit.activate(id);
        }
    }

    $scope.setCategory = function (value, suppressEditReset) {
        if (value) {
            $scope.category = value;
            PreferenceService.set(CATEGORY_PREFERENCE_KEY, $scope.category, false);
            $scope.redrawPlans();

            if (!suppressEditReset) {
                $scope.edit.reset();
            }
        }
    };

    $scope.broadcast = function (name) {
        $scope.$broadcast(name);
    };

    function addPlan (data) {
        return MaintenanceService.plans.create(data).then(function (plan) {
            $scope.scrollToPlan(plan.maintenance_id);
        });
    }

    $scope.newSuggestion = function () {
        return addPlan({
            suggestion: Maintenance.SUGGESTION.PROPOSED,
            hidden: true
        });
    };

    function init() {
        $scope.redrawPlans();
    }

    $scope.$watchCollection('plans.all', init);
    $scope.loadPlans(true);

    SystemsService.getSystemTypesAsync().then(function (systemTypes) {
        $scope.systemTypes = systemTypes;
    });

    $rootScope.$on('reload:data', function () {
        $scope.loader.loading = false; // disable loader throttling for reload
        $scope.loadPlans(true);
    });

    // mass removal of plans for internal users
    let deleteCounter = 0;
    $document.on('keydown', event => {
        deleteCounter = (event.keyCode === 46) ? deleteCounter + 1 : 0;
        if (deleteCounter > 6 && $scope.isInternal) {
            deleteCounter = 0;
            const plans = MaintenanceService.plans;
            sweetAlert({ text: 'Do you really want to delete ALL plans?' })
            .then(() => sweetAlert({ title: `REALLY ALL ${plans.all.length} PLANS?` }))
            .then(() => plans.all.forEach(Maintenance.deletePlan));
        }
    });
}

statesModule.controller('MaintenanceCtrl', MaintenanceCtrl);
