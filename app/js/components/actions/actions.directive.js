/*global require*/
'use strict';

var componentsModule = require('../');

/**
 * @ngInject
 */
function ActionsDirectiveCtrl($scope, RhaTelemetryActionsService) {
    $scope.loading     = RhaTelemetryActionsService.vars.loading;
    $scope.getTotal    = RhaTelemetryActionsService.getTotal;
    $scope.isActions   = RhaTelemetryActionsService.isActions;
    $scope.getCategory = RhaTelemetryActionsService.getCategory;
}

function rhaTelemetryActions() {
    return {
        templateUrl: 'js/components/actions/actions.html',
        restrict: 'E',
        replace: false,
        scope: {},
        controller: ActionsDirectiveCtrl
    };
}

componentsModule.directive('rhaTelemetryActions', rhaTelemetryActions);
