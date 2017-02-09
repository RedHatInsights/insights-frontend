'use strict';

var statesModule = require('../');

var params = {showAll: true};

/**
 * @ngInject
 */
function ListAnnouncementCtrl(
    $scope,
    $location,
    $state,
    $stateParams,
    $timeout,
    Announcement,
    AnnouncementService,
    User,
    PermalinkService,
    PermissionService) {

    $scope.params = params;
    AnnouncementService.init($scope.params);
    $scope.announcements = AnnouncementService.announcements;
    $scope.canCreate = false;
    $scope.permalink = PermalinkService.make;

    if ($stateParams.announcementId) {
        $scope.announcementId = $stateParams.announcementId.toString();
    }

    $scope.reload = function () {
        AnnouncementService.reload($scope.params);
    };

    User.asyncCurrent(function (user) {
        $scope.canCreate =
            (user &&
            PermissionService.has(user, PermissionService.PERMS.CREATE_ANNOUNCEMENT));
    });

    $scope.$on('reload:data', $scope.reload);
}

/**
 * @ngInject
 */
function ViewAnnouncementCtrl($scope, $stateParams, Announcement) {
    $scope.loadingAnnouncement = true;
    Announcement.bySlug($stateParams.slug).then(function (announcement) {
        $scope.announcement = announcement.data;
        $scope.loadingAnnouncement = false;
    });
}

/**
 * @ngInject
 */

function EditAnnouncementCtrl(
    $scope,
    $rootScope,
    $state,
    $stateParams,
    Announcement,
    AnnouncementService) {

    $scope.loadingAnnouncement = true;
    AnnouncementService.init();
    Announcement.byId($stateParams.id).then(function (announcement) {
        $scope.announcement = announcement.data;
        $scope.loadingAnnouncement = false;
    });

    $scope.save = function () {
        AnnouncementService.updateAnnouncement($scope.announcement).success(function () {
            $rootScope.$broadcast('announcement:changed');
            $state.go('app.announcements');
        })
        .error(function (data) {
            $scope.announcementError = data;
        });
    };
}

/**
 * @ngInject
 */
function NewAnnouncementCtrl($scope, $rootScope, $state, Announcement) {
    $scope.announcement = {
        hidden: false,
        start: new Date().toISOString()
    };

    $scope.create = function () {
        Announcement.createAnnouncement($scope.announcement).success(function () {
            $rootScope.$broadcast('announcement:changed');
            $state.go('app.announcements');
        })
        .error(function (data) {
            $scope.announcementError = data;
        });
    };
}

statesModule.controller('ListAnnouncementCtrl', ListAnnouncementCtrl);
statesModule.controller('ViewAnnouncementCtrl', ViewAnnouncementCtrl);
statesModule.controller('EditAnnouncementCtrl', EditAnnouncementCtrl);
statesModule.controller('NewAnnouncementCtrl', NewAnnouncementCtrl);
