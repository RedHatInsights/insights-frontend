'use strict';

var componentsModule = require('../../');
var groupBy = require('lodash/groupBy');
var map = require('lodash/map');
var uniq = require('lodash/uniq');

/**
 * @ngInject
 */
function configPermissionsCtrl(
    $scope,
    $q,
    SweetAlert,
    UserPermissions,
    Permission,
    User) {

    var priv = {};

    $scope.newPermission = {};

    priv.swalConfig = {
        title: 'Are you sure?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#DD6B55',
        confirmButtonText: 'Yes, delete it!',
        closeOnConfirm: true
    };

    priv.removeAll = function (data) {
        var dfrds = [];
        data.forEach(function (p) {
            dfrds.push(UserPermissions.delete({
                userPermissionId: p.id
            }).$promise);
        });

        $q.all(dfrds).finally(function () {
            $scope.init();
        });
    };

    $scope.isCreating = false;

    $scope.addNewPermission = function () {
        var newUserPermission;
        $scope.newPermission.permission_id = $scope.tmpPermission.id;
        newUserPermission = new UserPermissions($scope.newPermission);
        newUserPermission.$save().finally(function () {
            $scope.init();
        });
    };

    $scope.removeSingle = function (p) {
        $scope.removeAll([{
            id: p.id
        }]);
    };

    $scope.removeAll = function (data) {
        var conf = priv.swalConfig;

        if (data[0].sso_username === User.current.sso_username) {
            conf = JSON.parse(JSON.stringify(priv.swalConfig));
            conf.text = 'Delete yourself?? Remember... no dumb here!';
        }

        SweetAlert.swal(conf, function (confirm) {
            if (confirm) {
                priv.removeAll(data);
            }
        });
    };

    $scope.init = function () {
        Permission.query().$promise.then(function (data) {
            $scope.permissions = data;
        });

        UserPermissions.query().$promise.then(function (data) {
            $scope.users = uniq(map(data, 'sso_username'));
            $scope.userMap = groupBy(data, function (element) {
                return element.sso_username;
            });
        });
    };

    $scope.init();
}

function configPermissions() {
    return {
        templateUrl: 'js/components/config/permissions/permissions.html',
        restrict: 'EA',
        scope: false,
        controller: configPermissionsCtrl
    };
}

componentsModule.directive('configPermissions', configPermissions);
