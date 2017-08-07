'use strict';

var componentsModule = require('../');

/**
 * @ngInject
 */
function groupFormCtrl($scope, Group, $document, $timeout) {
    $scope.create = function (group) {
        $scope.isCreating = true;
        Group.createGroup(group).then(function (group) {
            $scope.isCreating = false;
            if (group && group.id) {
                $timeout(function () {
                    $document.scrollTo(
                        document.getElementById('group-' + group.id), 20, 300);
                }, 0);
            }
        }, function () {

            $scope.isCreating = false;
        });

        $scope.newGroup = {
            display_name: ''
        };
    };

    $scope.newGroup = {
        display_name: ''
    };
}

function groupForm() {
    return {
        templateUrl: 'js/components/group/views/form.html',
        restrict: 'EC',
        controller: groupFormCtrl
    };
}

componentsModule.directive('groupForm', groupForm);
