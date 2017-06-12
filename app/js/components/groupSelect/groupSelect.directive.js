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
    gettextCatalog,
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

    $scope.createGroup = GroupService.createGroup;
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
