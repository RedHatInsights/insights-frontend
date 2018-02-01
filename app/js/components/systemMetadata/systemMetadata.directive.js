'use strict';

var componentsModule = require('../');
const find = require('lodash/find');

/**
 * @ngInject
 */
function systemMetadataCtrl(
    $rootScope,
    $scope,
    InsightsConfig,
    System,
    SystemsService,
    $timeout) {

    let currentTab = null;
    let system_metadata;

    $scope.config = InsightsConfig;
    $scope.rowLimit = 3;
    $scope.expanded = false;
    $scope.loading = false;
    $scope.hovering = false;
    $scope.showAll = false;
    $scope.tabsContent = {
        system: null,
        network: null
    };

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
        return tab ? tab.noData : false;
    };

    $scope.showExpandTableBtn = function () {
        const tabContent = $scope.tabsContent[currentTab];
        return (tabContent && !tabContent.noData) ?
               tabContent.data.length > $scope.rowLimit :
               false;
    };

    $scope.toggleExpandTable = function () {
        $scope.showAll = !$scope.showAll;
    };

    $scope.toggleHovering = function () {
        $scope.hovering = !$scope.hovering;
    };

    $scope.getData = function (category, $event) {
        if (currentTab === category) {
            currentTab = null;

            // removes the active class from bootstrat/angular
            // tabs that are using data-toggle
            angular.element(document.getElementById(`${category}-tab`))
                .removeClass('active');
            angular.element(document.getElementById(`${category}`))
                .removeClass('active');

            // prevents the event from propagating to data-toggle
            // so it cannot add the "active" class back to the tabs
            $event.stopPropagation();
            $event.preventDefault();
        } else {
            currentTab = category;
            if (!$scope.tabsContent[category]) {
                const data = find(system_metadata, {category: category});

                if (data && !data.noData) {
                    $scope.tabsContent[category] = data;
                }
            }
        }
    };

    $scope.getUUID = function () {
        if ($scope.system.machine_id) {
            return $scope.system.machine_id; // for legacy
        }

        return $scope.system.system_id;
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

    $scope.rename = function (newValue) {
        return System.update($scope.system.system_id, {
            display_name: newValue
        }).then(function (res) {
            $scope.system.display_name = res.data.display_name;
            $rootScope.$broadcast('reload:data');
        });
    };

    $scope.networkSorter = function (value) {
        return parseInt(value.port);
    };
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
