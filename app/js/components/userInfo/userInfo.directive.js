'use strict';

var componentsModule = require('../');
var filter = require('lodash/filter');

/**
 * @ngInject
 */
function UserInfoDirectiveCtrl($scope, AccountService, AnnouncementService, User) {
    AnnouncementService.getAnnouncements({showAll: true}).then(function (res) {
        $scope.accountNumber = res.data;
        $scope.alerts = {
            unseen: filter(res.data, { seen: false })
        };
    });

    User.asyncCurrent(function (user) {
        $scope.user = user;
    });
}

function userInfo() {
    return {
        templateUrl: 'js/components/userInfo/userInfo.html',
        restrict: 'E',
        replace: false,
        scope: {},
        controller: UserInfoDirectiveCtrl
    };
}

componentsModule.directive('userInfo', userInfo);
