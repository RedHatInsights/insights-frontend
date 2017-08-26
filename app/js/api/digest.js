'use strict';

var apiModule = require('./');

/**
 * @ngInject
 */
function Digest($http, InsightsConfig, AccountService) {
    var root = InsightsConfig.apiRoot;

    return {
        getDigest: function (digest_id) {
            var url = root + 'digests/' +
                             digest_id +
                             AccountService.current();
            return $http.get(url);
        },

        getDigestsByType: function (digest_type_id) {
            var url = root + 'digests?remote_branch=-2&digest_type_id=' +
                             digest_type_id +
                             AccountService.current('&');
            return $http.get(url);
        }
    };
}

apiModule.factory('Digest', Digest);
