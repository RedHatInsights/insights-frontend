'use strict';

var componentsModule = require('../../');

function maintenanceTable(template) {
    return function () {
        return {
            restrict: 'E',
            controller: 'MaintenanceTableCtrl',
            controllerAs: 'table',
            scope: {
                paramsCallback: '&params',
                edit: '=',
                item: '=',
                onSave: '&',
                onCancel: '&'
            },
            templateUrl: 'js/components/maintenance/maintenanceTable/' + template,
            replace: true
        };
    };
}

componentsModule.directive(
    'maintenanceTableSystems',
    maintenanceTable('maintenanceTableSystems.html'));
componentsModule.directive(
    'maintenanceTableActions',
    maintenanceTable('maintenanceTableActions.html'));
