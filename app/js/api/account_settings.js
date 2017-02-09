'use strict';

var apiModule = require('./');

/**
 * @ngInject
 */
function AccountSettings($http, InsightsConfig) {
    var root = InsightsConfig.apiRoot;

    return {
        get: function () {
            return $http.get(root + 'account/settings');
        },

        update: function (settings) {
            return $http.post(root + 'account/settings', settings);
        }
    };
}

apiModule.factory('AccountSettings', AccountSettings);
