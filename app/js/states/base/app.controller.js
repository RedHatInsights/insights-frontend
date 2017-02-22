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
}

statesModule.controller('AppCtrl', AppCtrl);
