'use strict';

var componentsModule = require('../../../../');

function MaintenancePlanLiteTable() {
    return {
        templateUrl: 'js/components/overview/widgets/maintenancePlanLite/' +
            'maintenancePlanLiteTable/maintenancePlanLiteTable.html',
        restrict: 'E',
        replace: false,
        scope: true,
        link: function (scope, element, attr) {
            scope.plans = scope.$parent.$eval(attr.plans);
            if (angular.isDefined(attr.overdue)) {
                scope.overdue = scope.$parent.$eval(attr.overdue);
            }
        }
    };
}

componentsModule.directive('maintenancePlanLiteTable', MaintenancePlanLiteTable);
