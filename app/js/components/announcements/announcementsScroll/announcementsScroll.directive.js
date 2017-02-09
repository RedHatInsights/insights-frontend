'use strict';

var componentsModule = require('../../');

/**
 * @ngInject
 */
function announcementsScrollCtrl(
    $scope,
    $state,
    $stateParams,
    $timeout,
    AnnouncementService,
    User,
    PermalinkService,
    PermissionService,
    SweetAlert) {

    $scope.params = {showAll: true};
    AnnouncementService.init($scope.params);
    $scope.announcements = AnnouncementService.announcements;
    $scope.canCreate = false;
    $scope.permalink = PermalinkService.make;

    if ($stateParams.announcementId) {
        // wait for view to render before scrolling to announcement
        $timeout(function () {
            $scope.permalink($stateParams.announcementId.toString(), 10, 30);
        }, 100);
    }

    $scope.reload = function () {
        AnnouncementService.reload($scope.params);
    };

    $scope.ackAnnouncement = function (announcement) {
        AnnouncementService.acknowledge(announcement);
    };

    $scope.editAnnouncement = function (announcement) {
        $state.go('app.edit-announcement', {
            id: announcement.id
        });
    };

    $scope.deleteAnnouncement = function (announcement) {
        SweetAlert.swal({
            title: 'Are you sure?',
            type: 'warning',
            confirmButtonColor: '#DD6B55',
            confirmButtonText: 'Yes',
            showCancelButton: true
        }, function (isConfirm) {
            if (isConfirm) {
                AnnouncementService.deleteAnnouncement(announcement);
            }
        });
    };

    User.asyncCurrent(function (user) {
        $scope.canCreate =
            (user &&
            user.is_internal &&
            PermissionService.has(user, PermissionService.PERMS.CREATE_ANNOUNCEMENT));
    });
}

function announcementsScroll() {
    return {
        templateUrl:
            'js/components/announcements/announcementsScroll/announcementsScroll.html',
        restrict: 'E',
        replace: true,
        controller: announcementsScrollCtrl
    };
}

componentsModule.directive('announcementsScroll', announcementsScroll);
