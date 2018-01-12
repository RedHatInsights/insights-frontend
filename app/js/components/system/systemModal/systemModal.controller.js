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
    ModalUtils) {

    // set the default tab for system modal; system if no value is passed in
    $scope.activeTab = 'system';
    $scope.report = {};
    $scope.modal = $modalInstance;
    $scope.tabs = {
        Rules: 0,
        Policies: 1,
        Vulnerabilities: 2
    };

    // set the default tab for system modal; system if no value is passed in
    $scope.activeTab = $scope.tabs[activeTab || 'Rules'];

    $scope.isActive = function (tab) {
        console.log(tab);
        console.log($scope.tabs[tab]);
        console.log('--------------------');
        return $scope.tabs[tab];
    };

    $scope.activateTab = function (activatingTab) {
        $scope.activeTab = $scope.tabs[activatingTab];
    };

    // enables tab hack
    $scope.setActive = function (name) {
        $scope.activeTab = name;
    };

    // if there are no policies, hide the policies tab
    function init () {
        System.getSystemPolicies($scope.system.system_id).then((policies) => {
            $scope.hasPolicies = policies.data.total > 0;
            $scope.activeTab = activeTab || $scope.activeTab;
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
