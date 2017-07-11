'use strict';

var componentsModule = require('../');
let find = require('lodash/find');

/**
 * @ngInject
 */
function systemMetadataCtrl($scope, System, SystemsService, $timeout) {
    let timer;
    let system_metadata;
    $scope.tableRowLimit = 10;
    $scope.isValidData = true;
    $scope.expandedTabs = false;
    $scope.showData = false;
    $scope.expandIndefinite = false;
    $scope.loading = false;

    if ($scope.system && $scope.system.system_id) {
        $scope.loading = true;
        System.getSystemMetadata($scope.system.system_id)
        .then(function (metadata) {
            system_metadata = metadata;
            $scope.initialMetadata =
                SystemsService.getInitialSystemMetadata($scope.system, metadata.data);
            system_metadata =
                SystemsService.getSystemMetadata(metadata);
            $scope.loading = false;
        });
    }

    $scope.getData = function (category) {
        $scope.tableData = find(system_metadata, {category: category});

        if ($scope.tableData.values.length === 0) {
            $scope.isValidData = false;
        }
    };

    $scope.expandTabsIndefinite = function () {
        cancelTimer();

        if ($scope.expandedTabs) {
            $scope.expandedTabs = false;
        }

        $scope.expandIndefinite = true;
    };

    $scope.toggleTabsIndefinite = function () {
        cancelTimer();

        if ($scope.expandedTabs) {
            $scope.expandedTabs = false;
        }

        $scope.expandIndefinite = !$scope.expandIndefinite;
    };

    $scope.expandTabContent = function () {
        cancelTimer();

        $scope.expandedTabs = true;
    };

    $scope.tabCollapseTimer = function () {
        timer = $timeout(function () {
            $scope.expandedTabs = false;
        }, 3000);
    };

    $scope.getUUID = function () {
        if ($scope.system.machine_id) {
            return $scope.system.machine_id; // for legacy
        }

        return $scope.system.system_id;
    };

    function cancelTimer() {
        if (timer) {
            $timeout.cancel(timer);
        }
    }
}

function systemMetadata() {
    return {
        templateUrl: 'js/components/systemMetadata/systemMetadata.html',
        restrict: 'E',
        controller: systemMetadataCtrl,
        scope: {
            system: '=',
            expandable: '@',
            onToggle: '&'
        }
    };
}

componentsModule.directive('systemMetadata', systemMetadata);
