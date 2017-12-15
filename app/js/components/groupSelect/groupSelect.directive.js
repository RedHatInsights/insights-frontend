'use strict';

var componentsModule = require('../');
var isEmpty = require('lodash/isEmpty');

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
    $scope.group = Group.current();
    $scope.dropdown = false;

    $scope.resetFilter = function () {
        $scope.$broadcast(Events.filters.reset);
    };

    $scope.isGroupSelected = function () {
        return !isEmpty($scope.group);
    };

    $scope.createGroup = function () {
        GroupService.createGroup().then(function (group) {
            const html = gettextCatalog.getString(
                'Use <strong>Actions</strong> dropdown in the inventory to add systems ' +
                'to the <code>{{name}}</code> group',
                {
                    name: group.display_name
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

    $scope.$on(Events.filters.reset, function () {
        $scope.group = Group.current();
        $scope.groups = $scope._groups;
    });

    $rootScope.$on('group:change', function (event, group) {
        $scope.group = group;
    });
}

function groupSelect() {
    return {
        templateUrl: 'js/components/groupSelect/groupSelect.html',
        restrict: 'E',
        replace: true,
        controller: groupSelectCtrl,
        scope: {
            disabled: '<'
        }
    };
}

componentsModule.directive('groupSelect', groupSelect);
