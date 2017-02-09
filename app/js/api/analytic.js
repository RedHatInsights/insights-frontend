'use strict';

var apiModule = require('./');

/**
 * @ngInject
 */
function Analytic($http, InsightsConfig) {
    var root = InsightsConfig.apiRoot;
    return {
        reports: function () {
            return $http.get(root + 'analytics/reports');
        },

        systems: function () {
            return $http.get(root + 'analytics/systems');
        }
    };
}

apiModule.factory('Analytic', Analytic);
