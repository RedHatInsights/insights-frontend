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
    gettextCatalog,
    sweetAlert,
    Events,
    Group,
    GroupService) {
    Group.init();
    $scope.groups = Group.groups;
    $scope.group = Group.current();

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
    });

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
