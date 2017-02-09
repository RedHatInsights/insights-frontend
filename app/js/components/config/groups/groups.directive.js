'use strict';

var componentsModule = require('../../');

/**
 * @ngInject
 */
function configGroupsCtrl($scope, Group) {
    Group.init();
    $scope.isCreating = false;
    $scope.groups = Group.groups;
}

function configGroups() {
    return {
        templateUrl: 'js/components/config/groups/groups.html',
        restrict: 'EA',
        scope: false,
        controller: configGroupsCtrl
    };
}

componentsModule.directive('configGroups', configGroups);
