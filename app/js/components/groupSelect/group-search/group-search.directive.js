'use strict';

var componentsModule = require('../../');
const _filter = require('lodash/filter');

/**
 * @ngInject
 */
function groupSearchCtrl(
    $q,
    $scope,
    Group,
    GroupService,
    Events) {

    Group.init();
    $scope._groups = Group.groups;
    $scope.groups = $scope._groups;
    $scope.searching = false;

    $scope.hideSelectedGroup = function (group) {
        if (Group.current() &&
            Group.current().display_name &&
            Group.current().display_name === group.display_name) {
            return false;
        }

        return true;
    };

    $scope.showAllSystems = function () {
        if (Group.current() && Group.current().display_name && !$scope.searching) {
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

    $scope.$on(Events.filters.reset, function () {
        $scope.groups = $scope._groups;
    });

    $scope.$on('account:change', function () {
        Group.setCurrent(null);
    });
}

function groupSearch() {
    return {
        templateUrl: 'js/components/groupSelect/group-search/group-search.html',
        restrict: 'E',
        replace: true,
        controller: groupSearchCtrl
    };
}

componentsModule.directive('groupSearch', groupSearch);
