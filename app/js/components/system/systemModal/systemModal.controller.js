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
    SystemModalTabs,
    User) {

    // set the default tab for system modal; system if no value is passed in
    $scope.activeTab = 'system';
    $scope.report = {};
    $scope.modal = $modalInstance;
    $scope.tabs = {};
    angular.extend($scope.tabs, SystemModalTabs);

    User.asyncCurrent(user => $scope.isInternal = user.is_internal);

    // enables tab hack
    $scope.setActive = function (name) {
        $scope.activeTab = name;
    };

    // if there are no policies, hide the policies tab
    function init () {
        System.getSystemPolicies($scope.system.system_id).then((policies) => {
            $scope.hasPolicies = policies.data.total > 0;

            // set the default tab for system modal; system if no value is passed in
            $scope.tabs.activeTab = activeTab || $scope.tabs.rules;
        });
        System.getVulnerabilities($scope.system.system_id).then((vulnerabilities) => {
            $scope.hasVulnerabilities = vulnerabilities.data.total > 0;

            // set the default tab for system modal; system if no value is passed in
            $scope.tabs.activeTab = activeTab || $scope.tabs.rules;
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

    const stateChangeUnreg = $rootScope.$on('$stateChangeStart',
        function (event, toState, toParams, fromState, fromParams) {
        if (toParams.rhsaSeverity === fromParams.rhsaSeverity &&
            toParams.daysKnown === fromParams.daysKnow) {
            close();
        }
    });

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

    function getUrl() {
        return $location.search();
    }

    $scope.$watch(getUrl, function () {
        let params = $location.search();
        if (params.activeTab !== $scope.tabs.activeTab) {
            $scope.tabs.activeTab = params.activeTab;
        }
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
