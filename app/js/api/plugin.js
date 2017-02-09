'use strict';

var apiModule = require('./');

/**
* @ngInject
*/
function Plugin($http, InsightsConfig) {
    const v3root = InsightsConfig.apiPrefix + 'v3/';

    return {
        update: function (id, payload) {
            return $http.put(v3root + 'plugins/' + id, payload);
        }
    };
}

apiModule.factory('Plugin', Plugin);
