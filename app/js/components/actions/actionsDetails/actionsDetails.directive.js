'use strict';

var componentsModule = require('../../');

/**
 * @ngInject
 */
function ActionsDetailsCtrl(
    $scope,
    $location,
    InsightsConfig,
    RhaTelemetryActionsService) {

    $scope.isActions = RhaTelemetryActionsService.isActions;
    $scope.getLoadingDetails = RhaTelemetryActionsService.getLoadingDetails;
    $scope.getData = RhaTelemetryActionsService.getData;
    $scope.getRule = RhaTelemetryActionsService.getRule;
    $scope.arcClick = RhaTelemetryActionsService.arcClick;
    $scope.ackAction = RhaTelemetryActionsService.ackAction;

    $scope.getTitle = function () {
        var response = RhaTelemetryActionsService.isActions() ?
            'Actions' :
            RhaTelemetryActionsService.getCategory();
        return response;
    };

    $scope.isSystemAlert = function (group) {
        if (group && group.id) {
            return InsightsConfig.systemAlerts[group.id];
        }
    };
}

function actionsDetails() {
    return {
        templateUrl: 'js/components/actions/actionsDetails/actionsDetails.html',
        restrict: 'EC',
        scope: {},
        controller: ActionsDetailsCtrl
    };
}

componentsModule.directive('actionsDetails', actionsDetails);
