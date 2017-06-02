'use strict';

var componentsModule = require('../');

/**
 * @ngInject
 */
function groupCtrl($scope, sweetAlert, Group, gettextCatalog) {
    $scope.isCollapsed = false;

    $scope.deleteGroup = function (group) {
        const html = gettextCatalog.getString(
            'You will not be able to recover <code>{{name}}</code>', {
                name: group.display_name
            });
        sweetAlert({
            html
        }).then(function () {
            Group.deleteGroup(group);
        });
    };
}

function group() {
    return {
        templateUrl: 'js/components/group/views/group.html',
        restrict: 'E',
        controller: groupCtrl
    };
}

componentsModule.directive('group', group);
