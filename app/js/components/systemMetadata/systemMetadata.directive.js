'use strict';

var componentsModule = require('../');
const find = require('lodash/find');
const demoData = require('../../demoData');

/**
 * @ngInject
 */
function systemMetadataCtrl(
    $rootScope,
    $scope,
    InsightsConfig,
    System,
    SystemsService) {

    $scope.loading = {
        pageLoading: true,
        reportsLoading: true
    };

    $scope.actionChoices = [{
        id: 'APPLY',
        label: 'Apply Now'
    }, {
        id: 'NEW',
        label: 'Create New Playbook'
    }, {
        id: 'ADD',
        label: 'Add to Existing Playbook'
    }];

    $scope.getSystemType = function () {
        return find($scope.systemMetadata, {category: 'system'}).type;
    };

    $scope.hasMetadata = function () {
        return find($scope.systemMetadata, {noData: false}) !== undefined;
    };

    $scope.getUUID = function () {
        if ($scope.system.machine_id) {
            return $scope.system.machine_id; // for legacy
        }

        return $scope.system.system_id;
    };

    $scope.networkSorter = function (value) {
        return parseInt(value.port);
    };

    $scope.applyRec = function () {
        demoData.applyFixes();
        $rootScope.$emit('reloadDemoData');
        loadData();
    };

    loadData();

    function loadData() {
        if ($scope.system && $scope.system.system_id) {
            $scope.loading.pageLoading = true;
            System.getSystemMetadata($scope.system.system_id)
                .then(function (metadata) {
                    $scope.initialMetadata =
                        SystemsService.getInitialSystemMetadata(
                            $scope.system,
                            metadata.data
                        );
                    $scope.systemMetadata =
                        SystemsService.getSystemMetadata($scope.system, metadata.data);
                    $scope.loading.pageLoading = false;
                });
        }
    }
}

function systemMetadata() {
    return {
        templateUrl: 'js/components/systemMetadata/systemMetadata.html',
        restrict: 'E',
        controller: systemMetadataCtrl,
        scope: {
            system: '='
        }
    };
}

componentsModule.directive('systemMetadata', systemMetadata);
