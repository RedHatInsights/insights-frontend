'use strict';

var servicesModule = require('./');

/**
 * @ngInject
 */
function AnnouncementService($rootScope, Announcement) {
    var pub = {};
    var parameters = {showAll: true};

    pub.unseen = { count: 0 };
    pub.announcements = [];
    pub.loaded = false;

    let _getAnnouncements = function (params) {
        return Announcement.getAnnouncements(params).success(function (announcements) {
            pub.announcements.length = 0;
            pub.unseen.count = 0;

            announcements.forEach(function (a) {
                if (a.acked === false) {
                    pub.unseen.count += 1;
                }
            });

            Array.prototype.push.apply(pub.announcements, announcements);
        });
    };

    pub.init = function (params) {
        pub.loaded = false;
        return _getAnnouncements(params).success(function () {
            pub.loaded = true;
        });
    };

    pub.updateAnnouncement = function (announcement) {
        return Announcement.updateAnnouncement(announcement);
    };

    pub.deleteAnnouncement = function (announcement) {
        Announcement.deleteAnnouncement(announcement).success(function () {
            var i = pub.announcements.findIndex(function (element) {
                return element.id === announcement.id;
            });

            if (i !== -1) {
                pub.announcements.splice(i, 1);
                $rootScope.$broadcast('announcement:changed', announcement);
            }
        });
    };

    pub.acknowledge = function (announcement) {
        return Announcement.acknowledge(announcement).success(function () {
            pub.unseen.count -= 1;
            announcement.acked = true;
            $rootScope.$broadcast('announcement:changed', announcement);
        });
    };

    pub.reload = function (params) {
        return _getAnnouncements(params ? params : parameters);
    };

    return pub;
}

servicesModule.service('AnnouncementService', AnnouncementService);
