'use strict';

var statesModule = require('../');
var groupBy = require('lodash/groupBy');
var sortBy = require('lodash/sortBy');
var values = require('lodash/values');
var moment = require('moment-timezone');
var CATEGORY_PREFERENCE_KEY = 'maintenance_plan_category';

const DEFAULT_CATEGORY = 'notSuggested';

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

//This handles the "basic" edit mode of a plan. Activated by clicking the hidden
//'Click to edit this plan' button next to the plan name.
function BasicEditHandler(plan, Maintenance, Utils, cb) {
    this.active = false;
    this.plan = plan;
    this.Maintenance = Maintenance;
    this.Utils = Utils;
    this.cb = cb;
}

BasicEditHandler.prototype.init = function () {
    if (this.plan) {
        this.name = this.plan.name;
        this.description = this.plan.description;
        if (this.plan.start) {
            this.start = moment(this.plan.start);
            let d = this.start;

            // we need to convert to Date (which possibly uses a different timezone)
            // so that we can bind the input to it
            this.time = new Date(d.year(), d.month(), d.day(), d.hour(), d.minute());
            this.duration = Math.round((this.plan.end - this.plan.start) / (60 * 1000));
        } else {
            this.start = null;
            this.time = null;
            this.duration = null;
        }
    } else {
        this.name = '';
        this.description = '';
        this.start = moment().startOf('day');
        this.dateChanged(this.start);
    }
};

BasicEditHandler.prototype.dateChanged = function (value) {
    if (value && !this.time) {
        this.time =
            new Date(
                this.start.year(),
                this.start.month(),
                this.start.day(),
                22, 0);
        this.duration = 60;
        this.sync();
    }
};

BasicEditHandler.prototype.sync = function () {
    if (this.start && this.time) {
        this.start.hours(this.time.getHours());
        this.start.minutes(this.time.getMinutes());
    }
};

BasicEditHandler.prototype.toggle = function () {
    if (!this.active) {
        this.init();
    }

    this.active = !this.active;
};

BasicEditHandler.prototype.getStart = function () {
    if (this.start) {
        return this.start.clone().toDate();
    }

    return null;
};

BasicEditHandler.prototype.getEnd = function () {
    if (this.start) {
        return this.start.clone().add(Math.max(this.duration, 1), 'm').toDate();
    }

    return null;
};

BasicEditHandler.prototype.save = function () {
    this.sync();
    if (this.cb) {
        return this.cb(this.name, this.description, this.getStart(), this.getEnd(), this);
    }
};

/**
 * @ngInject
 */
function MaintenanceCtrl(
    $scope,
    Maintenance,
    Utils,
    $stateParams,
    MaintenanceService,
    $filter,
    PreferenceService,
    PermalinkService,
    $state,
    $rootScope,
    SystemsService) {

    $scope.BasicEditHandler = BasicEditHandler;
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

    $scope.scrollToPlan = function (id, cat) {
        let category = cat || MaintenanceService.plans.findCategory(id);
        $scope.setCategory(category);
        $scope.edit.activate(id);
        PermalinkService.scroll('maintenance-plan-' + id);
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

    $scope.category = PreferenceService.get(CATEGORY_PREFERENCE_KEY) || DEFAULT_CATEGORY;
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
}

statesModule.controller('MaintenanceCtrl', MaintenanceCtrl);
