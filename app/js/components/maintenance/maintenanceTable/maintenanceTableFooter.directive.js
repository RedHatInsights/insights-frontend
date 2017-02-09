'use strict';

var componentsModule = require('../../');

componentsModule.directive('maintenanceTableFooter', function () {
    return {
        restrict: 'A',
        templateUrl: 'js/components/maintenance/' +
            'maintenanceTable/maintenanceTableFooter.html'
    };
});
