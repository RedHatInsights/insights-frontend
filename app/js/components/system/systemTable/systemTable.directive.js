'use strict';

var componentsModule = require('../../');
var indexBy = require('lodash/collection/indexBy');
var reject = require('lodash/collection/reject');

/**
 * @ngInject
 */
function systemTableCtrl($scope, System, Group, Utils, $filter, gettext) {
    var _systems;
    var lastClicked;
    var type = $scope.type;
    $scope._filteredSystems = [];
    $scope.indeterminate = false;
    $scope.items = [10, 25, 50, 100];
    $scope.itemsPerPage = 10;
    $scope.title = (type === 'in') ?
        gettext('Systems in This Group') :
        gettext('Available Systems');
    $scope.currentPage = 1;
    $scope.total = 0;
    $scope.maxPages = 4;
    $scope.systemFilter = '';
    $scope.checkboxes = {
        checked: false,
        items: {}
    };
    $scope.filterSystems = function () {
        $scope.filteredSystems = $filter('filter')($scope.systems, {
            hostname: $scope.systemsFilter
        });
        $scope.total = $scope.filteredSystems.length;
    };

    let resetChecked = Utils.resetChecked($scope.checkboxes);
    $scope.pageChanged = resetChecked;

    $scope.addSystems = function () {
        let systemsToAdd = [];
        let _systems = indexBy($scope._filteredSystems, 'system_id');
        for (let system_id in $scope.checkboxes.items) {
            if ($scope.checkboxes.items[system_id] && _systems[system_id]) {
                systemsToAdd.push(_systems[system_id]);
            }
        }

        Group.addSystems($scope.group, systemsToAdd);
        resetChecked();
    };

    $scope.removeSystems = function () {
        let systemsToRemove = [];
        for (let system_id in $scope.checkboxes.items) {
            if ($scope.checkboxes.items[system_id]) {
                systemsToRemove.push(system_id);
            }
        }

        Group.removeSystems($scope.group, systemsToRemove);
        resetChecked();
    };

    $scope.rowClick = function ($event) {
        if ($event.shiftKey && $event.type === 'mousedown') {
            // Prevents selection of rows on shift+click
            $event.preventDefault();
            return false;
        }

        let target = $event.currentTarget;
        if (!lastClicked) {
            lastClicked = target;
            return;
        }

        if ($event.shiftKey) {
            Utils.selectBetween(target, lastClicked, $scope.checkboxes.items);
        }

        lastClicked = target;
    };

    function filterGroupSystems() {
        if (!_systems || !_systems.length) {
            return;
        }

        let groupMachines = indexBy($scope.group.systems, 'system_id');
        $scope.systems = reject(_systems, function (s) {
            return !!groupMachines[s.system_id];
        });

        groupMachines = null;
        $scope.filterSystems();
    }

    if (type === 'in') {
        $scope.systems = $scope.group.systems;
        $scope.filterSystems();
        $scope.$watchCollection('group.systems', function () {
            $scope.filterSystems();
        });
    } else {
        System.getSystems(false).success(function (systems) {
            _systems = systems.resources;
            filterGroupSystems();
        });

        $scope.$watchCollection('group.systems', filterGroupSystems);
    }

    $scope.$watch('checkboxes.checked', function (value) {
        Utils.checkboxChecked(value, $scope._filteredSystems, $scope.checkboxes.items);
    });

    function itemsChanged() {
        var result = Utils.itemsChanged($scope._filteredSystems, $scope.checkboxes.items);
        $scope.totalChecked = result.totalChecked;
        $scope.indeterminate = result.indeterminate;
        if (angular.isDefined(result.checked)) {
            $scope.checkboxes.checked = result.checked;
        }
    }

    $scope.$watchCollection('checkboxes.items', itemsChanged);
}

function systemTable() {
    return {
        templateUrl: 'js/components/system/systemTable/systemTable.html',
        restrict: 'E',
        scope: {
            group: '=',
            type: '@'
        },
        controller: systemTableCtrl
    };
}

componentsModule.directive('systemTable', systemTable);
