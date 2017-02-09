'use strict';

var componentsModule = require('../../');
var moment = require('moment-timezone');

/**
 * @ngInject
 */
function maintenancePlanBarCtrl($scope, Maintenance, Utils, $stateParams) {
    $scope.minDate = moment().tz($scope.timezone.name).startOf('day');

    $scope.newPlan =
        new $scope.BasicEditHandler(
            null, $scope.timezone, Maintenance, Utils, null);

    function reset() {
        $scope.newPlan.init();

        // only used read-only to reset the calendar
        $scope.newPlan.today = moment($scope.minDate);
        if ($scope.newPlanForm) {
            $scope.newPlanForm.$setPristine();
        }
    }

    reset();

    $scope.cancel = function () {
        $scope.expandBar = false;
        reset();
    };

    $scope.stepOne = function () {
        $scope.expandBar = 'stepOne';
    };

    $scope.$on('stepOne', $scope.stepOne);

    $scope.stepTwo = function () {
        $scope.expandBar = 'stepTwo';
    };

    $scope.dateChanged = function (unused, value, explicit) {
        if (explicit && value && !($scope.minDate.isAfter(value))) {
            $scope.newPlan.start = moment(value).tz($scope.timezone.name);
            $scope.newPlan.sync();
            $scope.stepTwo();
        }
    };

    $scope.createAndRepeat = function () {
        $scope.stepOne();
        $scope.createPlan($scope.newPlan);
        reset();
    };

    $scope.createAndEdit = function () {
        $scope.createPlan($scope.newPlan).then(function (plan) {
            reset();
            $scope.edit.reset();
            $scope.scrollToPlan(plan.maintenance_id);
        });

        $scope.expandBar = false;
    };

    $scope.createPlan = $scope.loader.bind(function (newPlan) {
        newPlan.name = newPlan.name || '';
        newPlan.sync();

        return Maintenance.createPlan({
            name: newPlan.name,
            start: newPlan.getStart(),
            end: newPlan.getEnd()
        }).then(function (re) {
            return Maintenance.getMaintenancePlan(re.data.id).then(function (res) {
                var plan = res.data;
                $scope.plans.all.push(plan);
                $scope.plans.process();
                return plan;
            });
        });
    });

    //    if ($stateParams.newPlan) {
    //        $scope.stepOne();
    //    }
    if ($stateParams.maintenance_id === 'new') {
        $scope.stepOne();
    }
}

function maintenancePlanBar() {
    return {
        templateUrl:
            'js/components/maintenance/maintenancePlanBar/maintenancePlanBar.html',
        restrict: 'E',
        controller: maintenancePlanBarCtrl,
        replace: true
    };
}

componentsModule.directive('maintenancePlanBar', maintenancePlanBar);
