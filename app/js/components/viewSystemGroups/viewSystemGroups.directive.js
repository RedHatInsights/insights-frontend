'use strict';

var componentsModule = require('../');

/**
 * @ngInject
 */
function viewSystemGroupsCtrl($rootScope,
                              $scope,
                              $mdToast,
                              $state,
                              System,
                              Group) {
    $scope.undoDeleteGroup = null;
    $scope.groupLimit = 4;
    $scope.showAll = false;

    $scope.$on('modal.closing', $mdToast.hide);

    $scope.closeToast = $mdToast.hide;

    $scope.toggleShowAll = function () {
        $scope.showAll = !$scope.showAll;
    };

    $scope.undoDelete = function () {
        Group.addSystems($scope.undoDeleteGroup, $scope.system).success(function () {
            $scope.undoDeleteGroup = null;
            loadSystemGroups($scope.getUUID());
            $rootScope.$broadcast('reload:data');
            $mdToast.hide();
        });
    };

    $scope.showToast = function (h, v, grpName) {
        const tclass = 'stickyToast delete-system-from-group';
        const position = `${h} ${v}`;
        $scope.toastcontent = `System deleted from '${grpName}' group`;

        $mdToast.show({
            templateUrl: 'js/components/toasts/undoDeleteWithClose.html',
            position: position,
            toastClass: tclass,
            controller: 'viewSystemGroupsCtrl',
            hideDelay: 0,
            scope: $scope,
            preserveScope: true
        });
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
            $scope.undoDeleteGroup = group;
            loadSystemGroups($scope.getUUID());
            $rootScope.$broadcast('reload:data');
        });
    };

    $scope.inGroup = function () {
        if (!$scope.groups) {
            return false;
        }

        return $scope.groups.length > 0;
    };

    loadSystemGroups($scope.getUUID());
    function loadSystemGroups(uuid) {
        System.getSystemGroups(uuid).success(function (groups) {
            $scope.groups = groups;
        });
    }
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
