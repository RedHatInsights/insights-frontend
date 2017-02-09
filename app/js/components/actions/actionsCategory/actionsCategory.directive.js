/*global require*/
'use strict';

var componentsModule = require('../../');

/**
 * @ngInject
 */
function ActionsCategoryCtrl(
    $scope,
    $location,
    InsightsConfig,
    RhaTelemetryActionsService) {

    $scope.getLoadingDetails = RhaTelemetryActionsService.getLoadingDetails;
    $scope.getData = RhaTelemetryActionsService.getData;
    $scope.getRule = RhaTelemetryActionsService.getRule;
    $scope.arcClick = RhaTelemetryActionsService.arcClick;
    $scope.ackAction = RhaTelemetryActionsService.ackAction;
    $scope.isActions = RhaTelemetryActionsService.isActions;

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

function actionsCategory() {
    return {
        templateUrl: 'js/components/actions/actionsCategory/actionsCategory.html',
        restrict: 'E',
        scope: {},
        controller: ActionsCategoryCtrl
    };
}

componentsModule.directive('actionsCategory', actionsCategory);
