'use strict';

var componentsModule = require('../');

/**
 * @ngInject
 */
function rhaNotificationsCtrl($scope, $state, AlertService, RhaTelemetryActionsService) {
    $scope.alerts = AlertService.alerts;

    $scope.dismiss = function (index, type) {
        $scope.alerts.splice(index, 1);

        if (type === 'http' && $state.current.actions) {
            RhaTelemetryActionsService.reload();
        } else if (type === 'http') {
            $state.reload();
        }
    };
}

function rhaNotifications() {
    return {
        templateUrl: 'js/components/notifications/notifications.html',
        restrict: 'C',
        replace: true,
        controller: rhaNotificationsCtrl
    };
}

componentsModule.directive('rhaNotifications', rhaNotifications);
