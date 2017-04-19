'use strict';

var apiModule = require('./');

/**
* @ngInject
*/
function Plugin($http, InsightsConfig) {
    return {
        update: function (id, payload) {
            return $http.put(InsightsConfig.apiRoot + 'plugins/' + id, payload);
        }
    };
}

apiModule.factory('Plugin', Plugin);
