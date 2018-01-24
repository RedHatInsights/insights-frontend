/*global require, angular*/
'use strict';

const componentsModule = require('../');
const isEmpty = require('lodash/isEmpty');
const _filter = require('lodash/filter');
const escape  = require('lodash/escape');

/**
 * @ngInject
 */
function groupSelectCtrl(
    $rootScope,
    $q,
    $scope,
    $state,
    $timeout,
    gettextCatalog,
    sweetAlert,
    Events,
    Group,
    GroupService) {
    Group.init();
    $scope._groups = Group.groups;
    $scope.groups = $scope._groups;
    $scope.group   = Group.current();
    $scope.dropdown = false;
    $scope.searching = false;

    $scope.resetFilter = function () {
        $scope.$broadcast(Events.filters.reset);
    };

    $scope.hideSelectedGroup = function (group) {
        if ($scope.group &&
            $scope.group.display_name &&
            $scope.group.display_name === group.display_name) {
            return false;
        }

        return true;
    };

    $scope.showSelectedGroup = function (group) {
        if ($scope.group &&
            $scope.group.display_name &&
            $scope.group.display_name === group.display_name) {
            return true;
        }

        return false;
    };

    $scope.showAllSystems = function () {
        if ($scope.group && $scope.group.display_name && !$scope.searching) {
            return true;
        }

        return false;
    };

    $scope.searchGroups = function (search) {
        $scope.searching = true;
        if (search) {
            const filter = search.toLowerCase();
            $scope.groups = _filter($scope._groups, function (group) {
                return group.display_name.toLowerCase().indexOf(filter) > -1;
            });
        } else {
            $scope.groups = $scope._groups;
            $scope.searching = false;
        }
    };

    $scope.triggerChange = function (group) {
        Group.setCurrent(group);
    };

    $rootScope.$on('group:change', function (event, group) {
        $scope.group = group;
    });

    $scope.$on('account:change', function () {
        $scope.triggerChange(null);
    });

    $scope.isGroupSelected = function () {
        return !isEmpty($scope.group);
    };

    $scope.$on(Events.filters.reset, function () {
        $scope.group = Group.current();
        $scope.groups = $scope._groups;
    });

    $scope.createGroup = function () {
        GroupService.createGroup().then(function (group) {
            const html = gettextCatalog.getString(
                'Use <strong>Actions</strong> dropdown in the inventory to add systems ' +
                'to the <code>{{name}}</code> group',
                {
                    name: escape(group.display_name)
                });

            return sweetAlert({
                title: gettextCatalog.getString('Group created'),
                confirmButtonText: gettextCatalog.getString('OK'),
                type: 'info',
                html,
                showCancelButton: false
            });
        }).then(function () {
            if ($state.current.name !== 'app.inventory') {
                $state.go('app.inventory');
            }
        });
    };

    $scope.toggleDropdown = function () {
        $scope.dropdown = !$scope.dropdown;
    };

    $scope.keypress = function (event) {
        if (event.which === 27) {
            $scope.$broadcast(Events.filters.reset);

            if ($scope.dropdown) {
                $scope.dropdown = false;
                angular.element(document.getElementById('global-filter-dropdown'))
                    .removeClass('open');
            }
        }
    };

    $scope.deleteGroup = GroupService.deleteGroup;
}

function groupSelect() {
    return {
        templateUrl: 'js/components/groupSelect/groupSelect.html',
        restrict: 'E',
        replace: true,
        controller: groupSelectCtrl,
        scope: {
            round: '=',
            disabled: '<'
        }
    };
}

componentsModule.directive('groupSelect', groupSelect);
