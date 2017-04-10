'use strict';

var statesModule = require('../');

/**
 * @ngInject
 */
function AppCtrl($scope, $rootScope, User, PermissionService) {
    User.asyncCurrent(function (user) {
        $rootScope.isContentManager =
            (PermissionService.has(user, PermissionService.PERMS.CONTENT_MANAGER));
    });

    $scope.toggleFullScreen = function () {
        if (window && window.jQuery) {
            console.log('togglingclass');
            window.jQuery('html').toggleClass('fullscreen');
        }
    };


    $scope.collapseExpand = function () {
        $scope.isNavCollapsed = true;
        $scope.isCollapsed = false;
    };
}

statesModule.controller('AppCtrl', AppCtrl);
