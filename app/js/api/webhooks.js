'use strict';

const apiModule = require('./');
const URI = require('urijs');
const pick = require('lodash/pick');

/**
 * @ngInject
 */
function Webhooks($http, AccountService, InsightsConfig) {
    const root = InsightsConfig.apiRoot;

    function url (...segments) {
        const url = URI(root);
        url.segment('webhooks');
        segments.forEach(segment => url.segment(String(segment)));
        url.addSearch(AccountService.queryParam());
        return url.toString();
    }

    return {

        get: function (...segments) {
            return $http.get(url(...segments));
        },

        create: function (webhook) {
            return $http.post(url(), webhook);
        },

        ping: function () {
            return $http.post(url('ping'));
        },

        update: function (webhook) {
            return $http.put(url(webhook.id), pick(webhook, ['active', 'url']));
        },

        delete: function (webhook) {
            return $http.delete(url(webhook.id));
        }
    };
}

apiModule.factory('Webhooks', Webhooks);
