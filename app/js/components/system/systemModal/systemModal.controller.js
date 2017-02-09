/*global require, angular*/
'use strict';

var componentsModule = require('../../');

/**
 * @ngInject
 */
function SystemModalCtrl(
    $scope,
    $rootScope,
    $location,
    $modalInstance,
    system,
    rule,
    AnalyticsService,
    Utils,
    $timeout) {

    var stateChangeUnreg;
    var escUnreg;

    $scope.report = {};

    function close() {
        $modalInstance.dismiss('close');
    }

    function setMachine(id) {
        $location.replace();
        $location.search('machine', id);
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

    $modalInstance.result.then(angular.noop, function () {
        setMachine(null);

        // defer unregistering of the esc suppressor
        $timeout(function () {
            escUnreg();
            stateChangeUnreg();
        });
    });

    setMachine($scope.system.machine_id);
    stateChangeUnreg = $rootScope.$on('$stateChangeStart', close);

    escUnreg = $rootScope.$on('telemetry:esc', function ($event) {
        $event.preventDefault();
        return false;
    });

    $scope.$on('destroy', function () {
        stateChangeUnreg();
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
