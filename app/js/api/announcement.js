/*global require*/
'use strict';

var apiModule = require('./');
var URI = require('urijs');

/**
 * @ngInject
 */
function Announcement($http, InsightsConfig) {
    var root = InsightsConfig.apiRoot;
    var pub = {};

    pub.getAnnouncements = function (params) {
        var url = URI(root + 'announcements');

        if (params) {
            url.addSearch(params);
        }

        return $http.get(url.toString());
    };

    pub.byId = function (id) {
        return $http.get(root + 'announcements/' + id);
    };

    pub.bySlug = function (slug) {
        return $http.get(root + 'announcements/' + slug);
    };

    pub.createAnnouncement = function (announcement) {
        return $http.post(root + 'announcements?internal=true', announcement);
    };

    pub.updateAnnouncement = function (a) {
        return $http.put(root + 'announcements/' + a.id, a);
    };

    pub.deleteAnnouncement = function (announcement) {
        return $http.delete(root + 'announcements/' + announcement.id);
    };

    pub.acknowledge = function (a) {
        return $http.post(root + 'announcements/' + a.id + '/ack');
    };

    return pub;
}

apiModule.factory('Announcement', Announcement);
