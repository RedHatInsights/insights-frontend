/*global require*/
'use strict';

var componentsModule = require('../');

/**
 * @ngInject
 */
function SystemOverviewCtrl(
    $scope,
    $rootScope,
    $location,
    $timeout,
    $q,
    $stateParams,
    AnalyticsService,
    FilterService,
    System) {

    // set the default tab for system modal; system if no value is passed in
    $scope.report = {};
    $scope.activeTab = 'system';
    $scope.system_id = $stateParams.id;

    // enables tab hack
    $scope.setActive = function (name) {
        $scope.activeTab = name;
    };

    // if there are no policies, hide the policies tab
    function init () {
        const policies = System.getSystemPolicies($scope.system_id).then((policies) => {
            $scope.hasPolicies = policies.data.total > 0;
        });

        const system = System.getSingleSystem($scope.system_id).then((res) => {
            $scope.system = res.data;
        });

        $q.all([policies, system]).finally(() => {
            $scope.loading.pageLoading = false;
        });
    }

    $scope.loading = {
        pageLoading: true,
        reportsLoading: true
    };

    if ($scope.system) {
        $scope.system = {
            hostname: 'this.is.a.fake.system',
            machine_id: 'fakemachineidfakemachineidfakemachineid',
            __fake: true
        };
    }

    $scope.getUUID = function () {
        if ($scope.system.machine_id) {
            return $scope.system.machine_id; // for legacy
        }

        return $scope.system.system_id;
    };

    init();
}

componentsModule.controller('SystemOverviewCtrl', SystemOverviewCtrl);
