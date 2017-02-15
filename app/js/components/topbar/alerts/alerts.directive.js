'use strict';

var componentsModule = require('../../');

/**
 * @ngInject
 */
function alertsCtrl($rootScope,
                    $scope,
                    $state,
                    gettextCatalog,
                    RhaTelemetryActionsService,
                    System,
                    TopbarAlertsService,
                    MaintenanceService,
                    FilterService,
                    InventoryService) {

    $scope.service = TopbarAlertsService;

    /*
     * Stale system alerts
     */
    function loadSystemAlerts () {
        $scope.loading = true;
        TopbarAlertsService.removeAll('stale');

        System.getSystemStatus(true).then(function (res) {
            if (res.data) {
                if (res.data.hasOwnProperty('stale') &&
                    res.data.hasOwnProperty('ackedStale') &&
                    (res.data.stale - res.data.ackedStale) > 0) {
                    TopbarAlertsService.push({
                        type: 'stale',
                        msg: gettextCatalog.getPlural(
                                (res.data.stale - res.data.ackedStale),
                                '1 new system not checking in',
                                '{{count}} new systems not checking in',
                                { count: (res.data.stale - res.data.ackedStale) }),
                        acked: false,
                        icon: 'fa-server',
                        onAck: ack,
                        onSelect: select
                    });
                }
            }
        }).finally(function () {
            $scope.loading = false;
        });
    }

    function ack () {
        return System.ackStaleSystems().then(loadSystemAlerts);
    }

    function goToInventory () {
        FilterService.setOnline(false);
        FilterService.setOffline(true);
        InventoryService.setSort({
            field: 'last_check_in',
            direction: 'DESC'
        });

        $state.go('app.inventory', {
            offline: true
        });
    }

    function select (item) {
        if (item.acked === false) {
            ack().then(goToInventory);
        } else {
            goToInventory();
        }
    }

    loadSystemAlerts();
    MaintenanceService.plans.load();
}

function alerts() {
    return {
        templateUrl: 'js/components/topbar/alerts/alerts.html',
        restrict: 'E',
        replace: true,
        scope: {
            icon: '@icon'
        },
        controller: alertsCtrl
    };
}

componentsModule.directive('alerts', alerts);
