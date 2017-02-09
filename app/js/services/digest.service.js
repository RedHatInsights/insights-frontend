'use strict';

var servicesModule = require('./');

/**
 * @ngInject
 */
function DigestService(Digest) {
    return {
        get: function (digest_id) {
            return Digest.getDigest(digest_id);
        },

        digestsByType: function (digest_type_id) {
            return Digest.getDigestsByType(digest_type_id);
        }
    };
}

servicesModule.service('DigestService', DigestService);
