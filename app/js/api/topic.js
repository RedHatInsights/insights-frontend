'use strict';

var apiModule = require('./');
var URI = require('urijs');

/**
 * @ngInject
 */
function Topic($http, $q, InsightsConfig, AccountService, Group) {
    var topicsUri = 'topics';
    var root = InsightsConfig.apiRoot;

    return {
        getAll: function (filters, limit) {
            var topicFilters = filters ? filters : {};
            var uri =
                URI(root + topicsUri + AccountService.current()).addSearch(topicFilters);
            if (angular.isDefined(limit)) {
                uri.addSearch('limit', limit);
            }

            uri.addSearch(Group.queryParam());

            return $http.get(uri.toString());
        },

        admin: function () {
            return $http.get(root + topicsUri + '/admin');
        },

        get: function (id, product) {
            var uri = URI(root + topicsUri + '/' + id + AccountService.current());
            if (product) {
                uri.addSearch('product', product);
            }

            uri.addSearch(Group.queryParam());

            return $http.get(uri.toString());
        },

        create: function (topic) {
            return $http.post(root + topicsUri, topic);
        },

        update: function (topic) {
            return $http.put(root + topicsUri + '/' + topic.id, topic);
        },

        preview: function (topic) {
            return $http.post(root + topicsUri + '/preview', topic);
        },

        remove: function (id) {
            return $http.delete(root + topicsUri + '/' + id);
        }
    };
}

apiModule.factory('Topic', Topic);
