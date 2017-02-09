'use strict';

var componentsModule = require('../');

/**
 * @ngInject
 */
function groupCtrl($scope, SweetAlert, Group, gettextCatalog) {
    $scope.isCollapsed = false;

    $scope.deleteGroup = function (group) {
        var message = gettextCatalog.getString(
            'You will not be able to recover <code>{{name}}</code>', {
                name: group.display_name
            });
        SweetAlert.swal({
                title: 'Are you sure?',
                text: message,
                type: 'warning',
                html: true,
                confirmButtonColor: '#DD6B55',
                confirmButtonText: 'Yes',
                showCancelButton: true
            },
            function (isConfirm) {
                if (isConfirm) {
                    Group.deleteGroup(group);
                }
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
