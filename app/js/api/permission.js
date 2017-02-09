'use strict';
var apiModule = require('./');

/**
 * @ngInject
 */
function Permission($resource, InsightsConfig) {
    var endpoint = InsightsConfig.apiRoot + 'permissions/:permissionId';
    var params = {
        permissionId: '@id'
    };
    var resource = $resource(endpoint, params);

    resource.init = function () {
        resource.initial = resource.query().$promise;
    };

    return resource;
}

apiModule.factory('Permission', Permission);
