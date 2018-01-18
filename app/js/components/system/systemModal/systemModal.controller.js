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
    activeTab,
    system,
    rule,
    AnalyticsService,
    FilterService,
    System,
    ModalUtils,
    SystemModalTabs) {

    // set the default tab for system modal; system if no value is passed in
    $scope.activeTab = 'system';
    $scope.report = {};
    $scope.modal = $modalInstance;
    $scope.tabs = SystemModalTabs;

    // enables tab hack
    $scope.setActive = function (name) {
        $scope.activeTab = name;
    };

    // if there are no policies, hide the policies tab
    function init () {
        System.getSystemPolicies($scope.system.system_id).then((policies) => {
            $scope.hasPolicies = policies.data.total > 0;

            // set the default tab for system modal; system if no value is passed in
            $scope.activeTab = activeTab || $scope.tabs.rules;
        });
    }

    function close() {
        $modalInstance.dismiss('close');
    }

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

    // Used to suppress escape keypress event from being handled
    // by parent scope.
    ModalUtils.suppressEscNavigation($modalInstance);

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

    init();
}

componentsModule.controller('SystemModalCtrl', SystemModalCtrl);
