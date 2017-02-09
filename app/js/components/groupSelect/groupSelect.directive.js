'use strict';

var componentsModule = require('../');
var isEmpty = require('lodash/lang/isEmpty');

/**
 * @ngInject
 */
function groupSelectCtrl($scope, Group, Events) {
    Group.init();
    $scope.groups = Group.groups;
    $scope.group = Group.current();

    $scope.triggerChange = function (group) {
        $scope.group = group;
        Group.setCurrent(group);
        $scope.$emit('group:change', group);
    };

    $scope.$on('account:change', function () {
        $scope.triggerChange(null);
    });

    $scope.isGroupSelected = function () {
        return !isEmpty($scope.group);
    };

    $scope.$on(Events.filters.reset, function () {
        $scope.group = Group.current();
    });
}

function groupSelect() {
    return {
        templateUrl: 'js/components/groupSelect/groupSelect.html',
        restrict: 'E',
        replace: true,
        controller: groupSelectCtrl,
        scope: {
            round: '='
        }
    };
}

componentsModule.directive('groupSelect', groupSelect);
