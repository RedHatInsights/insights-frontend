/*global require*/
'use strict';

var componentsModule = require('../../');

/**
 * @ngInject
 */
function SystemModalCtrl(
    $scope,
    $rootScope,
    $location,
    $timeout,
    $modalInstance,
    system,
    rule,
    AnalyticsService,
    Utils,
    FilterService) {

    $scope.report = {};

    function close() {
        $modalInstance.dismiss('close');
    }

    AnalyticsService.triggerEvent('InsightsCompletion');
    $scope.system = system;
    $scope.rule = rule;
    $scope.loading = {
        isLoading: true
    };

    if (system === false) {
        $scope.system = {
            hostname: 'this.is.a.fake.system',
            machine_id: 'fakemachineidfakemachineidfakemachineid',
            __fake: true
        };
    }

    $scope.close = close;

    FilterService.setMachine($scope.system.system_id);

    const stateChangeUnreg = $rootScope.$on('$stateChangeStart', close);

    const escUnreg = $rootScope.$on('telemetry:esc', function ($event) {
        $event.preventDefault();
        return false;
    });

    $modalInstance.result.then(angular.noop, function () {
        // defer unregistering of the esc suppressor
        $timeout(function () {
            escUnreg();
            stateChangeUnreg();
        });
    });

    $scope.$on('modal.closing', function () {
        FilterService.setMachine(null);
        escUnreg();
    });

    $scope.getUUID = function () {
        if ($scope.system.machine_id) {
            return $scope.system.machine_id; // for legacy
        }

        return $scope.system.system_id;
    };
}

componentsModule.controller('SystemModalCtrl', SystemModalCtrl);
