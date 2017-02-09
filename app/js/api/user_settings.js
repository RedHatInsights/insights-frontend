'use strict';

var apiModule = require('./');

/**
 * @ngInject
 */
function UserSettings($http, InsightsConfig) {
    var root = InsightsConfig.apiRoot;

    return {
        update: function (settings) {
            return $http.post(root + 'me/settings', settings);
        }
    };
}

apiModule.factory('UserSettings', UserSettings);
