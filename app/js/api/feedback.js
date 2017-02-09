'use strict';

var apiModule = require('./');

/**
 * @ngInject
 */
function Feedback($http, InsightsConfig) {
    var root = InsightsConfig.apiRoot;

    return {
        sendFeedback: function (feedback) {
            var url = root + 'feedback';
            return $http.post(url, feedback);
        }
    };
}

apiModule.factory('Feedback', Feedback);
