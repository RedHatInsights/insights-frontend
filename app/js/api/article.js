'use strict';

var apiModule = require('./');

/**
 * @ngInject
 */
function Article($http, AccountService, InsightsConfig) {
    var root = InsightsConfig.apiRoot;

    return {

        getArticles: function () {
            return $http.get(root + 'articles');
        },

        get: function (id) {
            return $http.get(root + 'articles/' + (id || InsightsConfig.overviewKey));
        },

        update: function (id, data) {
            return $http.put(root + 'articles/' + (id || InsightsConfig.overviewKey),
                data);
        },

        preview: function (data) {
            return $http.post(root + 'articles/preview', data);
        }
    };
}

apiModule.factory('Article', Article);
