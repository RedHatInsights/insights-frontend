'use strict';

var componentsModule = require('../');

/**
 * @ngInject
 */
function viewSystemGroupsCtrl($scope,
                              $mdToast,
                              $state,
                              System,
                              Group) {
    let undoDeleteGroup = null;
    const toasttemplate = '<md-toast>' +
            '<span>{{toastcontent}}</span>' +
            '<div class="undo-delete" ng-click="undoDelete()">Undo</div>' +
            '<div class="fa fa-times" ng-click="closeToast()"></div>' +
            '</md-toast>';

    $scope.groupLimit = 4;
    $scope.showAll = false;

    function loadSystemGroups(uuid) {
        System.getSystemGroups(uuid).success(function (groups) {
            $scope.groups = groups;
        });
    }

    $scope.toggleShowAll = function () {
        $scope.showAll = !$scope.showAll;
    };

    $scope.getUUID = function () {
        if ($scope.system.machine_id) {
            return $scope.system.machine_id; // for legacy
        }

        return $scope.system.system_id;
    };

    $scope.groupSelected = function (group) {
        // parent.parent === systemModal.controller.js
        $scope.$parent.$parent.close();
        Group.setCurrent(group);
        $state.go('app.inventory');
    };

    $scope.deleteSystemFromGroup = function (group) {
        Group.removeSystem(group, $scope.system).success(function () {
            undoDeleteGroup = group;
            loadSystemGroups($scope.getUUID());
        });
    };

    $scope.inGroup = function () {
        if (!$scope.groups) {
            return false;
        }

        return $scope.groups.length > 0;
    };

    $scope.undoDelete = function () {
        Group.addSystems(undoDeleteGroup, $scope.system).success(function () {
            loadSystemGroups($scope.getUUID());
            $mdToast.hide();
        });
    };

    $scope.showToast = function (h, v, grpName) {
        const tclass = 'stickyToast delete-system-from-group';
        const position = `${h} ${v}`;
        $scope.toastcontent = `System deleted from '${grpName}' group`;

        $mdToast.show({
            template: toasttemplate,
            position: position,
            toastClass: tclass,
            hideDelay: 0,
            scope: $scope,
            preserveScope: true
        });
    };

    $scope.closeToast = $mdToast.hide;

    loadSystemGroups($scope.getUUID());
}

function viewSystemGroups() {
    return {
        templateUrl: 'js/components/viewSystemGroups/viewSystemGroups.html',
        restrict: 'E',
        controller: viewSystemGroupsCtrl
    };
}

componentsModule.directive('viewSystemGroups', viewSystemGroups);
componentsModule.controller('viewSystemGroupsCtrl', viewSystemGroupsCtrl);
