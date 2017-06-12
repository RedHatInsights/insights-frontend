'use strict';

var componentsModule = require('../');

/**
 * @ngInject
 */
function groupCtrl($scope, sweetAlert, Group, gettextCatalog, GroupService) {
    $scope.isCollapsed = false;
    $scope.deleteGroup = GroupService.deleteGroup;
}

function group() {
    return {
        templateUrl: 'js/components/group/views/group.html',
        restrict: 'E',
        controller: groupCtrl
    };
}

componentsModule.directive('group', group);
