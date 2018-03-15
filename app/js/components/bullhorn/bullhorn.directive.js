'use strict';

var componentsModule = require('../');

/**
 * @ngInject
 */
function bullhornCtrl($rootScope, $scope, $state, Announcement, AnnouncementService) {
    $scope.loadingAnnouncements = true;

    $scope.selectAnnouncement = function (announcement) {
        $state.go('app.announcements', {
            announcementId: announcement.id
        });
    };

    $scope.ack = function (announcement) {
        $scope.loadingAnnouncements = true;
        AnnouncementService.acknowledge(announcement).then(function () {
            $scope.selectAnnouncement(announcement);
            $scope.loadingAnnouncements = false;
        });
    };

    function _getAnnouncements() {
        $scope.loadingAnnouncements = true;
        AnnouncementService.init().then(function () {
            $scope.items = AnnouncementService.announcements.slice(
                0, AnnouncementService.announcements.length < 7 ?
                    AnnouncementService.announcements.length : 6);
            $scope.unackedCount = AnnouncementService.unseen.count;
            $scope.loadingAnnouncements = false;
        });
    }

    switch ($scope.type) {
        case 'announcements':
            _getAnnouncements();
            break;
    }

    $rootScope.$on('announcement:changed', function () {_getAnnouncements();});
}

function bullhorn() {
    return {
        templateUrl: 'js/components/bullhorn/bullhorn.html',
        restrict: 'E',
        replace: true,
        scope: {
            type: '@type',
            icon: '@icon'
        },
        controller: bullhornCtrl
    };
}

componentsModule.directive('bullhorn', bullhorn);

