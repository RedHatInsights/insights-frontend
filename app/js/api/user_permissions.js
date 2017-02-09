'use strict';

var apiModule = require('./');

/**
 * @ngInject
 */
function UserPermissions($resource, InsightsConfig) {
    var endpoint = InsightsConfig.apiRoot + 'user_permissions/:userPermissionId';
    var params = {
        userPermissionId: '@id'
    };
    var resource = $resource(endpoint, params);

    resource.init = function () {
        resource.initial = resource.query().$promise;
    };

    return resource;
}

apiModule.service('UserPermissions', UserPermissions);
