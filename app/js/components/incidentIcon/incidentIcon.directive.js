/*global require*/
'use strict';

var componentsModule = require('../');

/**
 * @ngInject
 */
function incidentIconCtrl($rootScope, $scope, gettextCatalog, IncidentsService) {
    $scope.tooltip = gettextCatalog.getString('This is an incident. ' +
        'An incident means that this has already occurred.');

    IncidentsService.init().then(() => {
        $scope.isIncident = IncidentsService.isIncident($scope.ruleId) &&
            $rootScope.isBeta;
    });
}

function incidentIcon() {
    return {
        templateUrl: 'js/components/incidentIcon/incidentIcon.html',
        restrict: 'E',
        replace: true,
        controller: incidentIconCtrl,
        scope: {
            ruleId: '='
        }
    };
}

componentsModule.directive('incidentIcon', incidentIcon);
