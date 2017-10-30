'use strict';

var componentsModule = require('../');
const find = require('lodash/find');

/**
 * @ngInject
 */
function systemMetadataCtrl($scope, System, SystemsService, $timeout) {
    let system_metadata;
    let active = false;
    $scope.rowLimit = 3;
    $scope.expanded = false;
    $scope.loading = false;
    $scope.hovering = false;
    $scope.showAll = false;

    if ($scope.system && $scope.system.system_id) {
        $scope.loading = true;
        System.getSystemMetadata($scope.system.system_id)
        .then(function (metadata) {
            $scope.initialMetadata =
                SystemsService.getInitialSystemMetadata($scope.system, metadata.data);
            system_metadata =
                SystemsService.getSystemMetadata($scope.system, metadata.data);
            $scope.loading = false;
        });
    }

    $scope.getSystemType = function () {
        return find(system_metadata, {category: 'system'}).type;
    };

    $scope.hasMetadata = function () {
        return find(system_metadata, {noData: false}) !== undefined;
    };

    $scope.setDefaultTab = function () {
        if ($scope.system.report_count === 0) {
            expandPopulatedTab();
        }
    };

    $scope.toggleExpanded = function () {
        if ($scope.hovering || !$scope.expanded) {
            expandPopulatedTab();
        } else {
            $scope.showAll = false;
            $scope.expanded = !$scope.expanded;
        }
    };

    $scope.disableTab = function (category) {
        const tab = find(system_metadata, {category: category});

        if (tab) {
            return find(system_metadata, {category: category}).noData;
        } else {
            return false;
        }

    };

    $scope.showExpandTableBtn = function () {
        if ($scope.tableData && $scope.tableData.data) {
            return $scope.tableData.data.length > $scope.rowLimit;
        } else {
            return false;
        }
    };

    $scope.toggleExpandTable = function () {
        $scope.showAll = !$scope.showAll;
    };

    $scope.toggleActive = function () {
        active = !active;
    };

    $scope.toggleHovering = function () {
        $scope.hovering = !$scope.hovering;
    };

    $scope.isActive = function (category) {
        if ($scope.tableData) {
            return $scope.tableData.category === category && active;
        } else {
            return false;
        }
    };

    $scope.enableExpanded = function () {
        $scope.expanded = true;
        active = true;
    };

    $scope.getData = function (category) {
        const data = find(system_metadata, {category: category});

        if (data && !data.noData) {
            $scope.tableData = data;
        }
    };

    $scope.getUUID = function () {
        if ($scope.system.machine_id) {
            return $scope.system.machine_id; // for legacy
        }

        return $scope.system.system_id;
    };

    $scope.showHostname = function () {
        if ($scope.system.hostname && $scope.system.display_name) {
            return $scope.system.hostname !== $scope.system.display_name;
        } else if ($scope.system.hostname && $scope.system.displayName) {
            return $scope.system.hostname !== $scope.system.displayName;
        } else {
            return false;
        }
    };

    $scope.showHostnameHeader = function () {
        return $scope.system.hostname &&
               !$scope.system.display_name &&
               !$scope.system.displayName;
    };

    function expandPopulatedTab () {
        let tab = find(system_metadata, {noData: false, category: 'system'});

        if (!tab) {
            tab = find(system_metadata, {noData: false});
        }

        $timeout(function () {
            if (tab) {
                $scope.getData(tab);
                angular.element(document.getElementById(`${tab.category}-tab`)).click();
                $scope.expanded = true;
            }
        }, 0);
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
