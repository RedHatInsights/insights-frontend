'use strict';

var componentsModule = require('../../../');
var moment = require('moment-timezone');
var find = require('lodash/collection/find');

/**
 * @ngInject
 */
function MaintenancePlanLiteCtrl($scope, Maintenance, MaintenanceService, $state) {
    $scope.plans = MaintenanceService.plans;

    $scope.duration = function (start, end) {
        return moment.duration(
            moment(end)
            .diff(moment(start))).asMinutes();
    };

    $scope.silence = function (plan) {
        plan.silenced = true;
        return Maintenance.silence(plan);
    };

    $scope.getFirstSuggestion = function () {
        return find(MaintenanceService.plans.suggested, {hidden: false});
    };

    $scope.openPlan = function (plan) {
        $state.go('app.maintenance', {
            maintenance_id: plan.maintenance_id
        });
    };
}

function MaintenancePlanLite() {
    return {
        templateUrl: 'js/components/overview/widgets/' +
            'maintenancePlanLite/maintenancePlanLite.html',
        restrict: 'E',
        replace: true,
        scope: true,
        controller: MaintenancePlanLiteCtrl
    };
}

componentsModule.directive('maintenancePlanLite', MaintenancePlanLite);
