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
    $scope.expandedTabs = false;
    $scope.isValidMetadata = true;
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

    $scope.getMetadata = function (category) {
        $scope.metadata = find(system_metadata, {category: category});

        if ($scope.metadata.values.length === 0) {
            $scope.isValidMetadata = false;
        }
    };

    $scope.expandTabsIndefinite = function () {
        if (timer) {
            $timeout.cancel(timer);
        }

        if ($scope.expandedTabs) {
            $scope.expandedTabs = false;
        }

        $scope.expandIndefinite = true;
    };

    $scope.toggleTabsIndefinite = function () {
        if (timer) {
            $timeout.cancel(timer);
        }

        if ($scope.expandedTabs) {
            $scope.expandedTabs = false;
        }

        $scope.expandIndefinite = !$scope.expandIndefinite;
    };

    $scope.expandTabContent = function () {
        if (timer) {
            $timeout.cancel(timer);
        }

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
