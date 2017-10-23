'use strict';

const apiModule = require('./');
const URI = require('urijs');
const pick = require('lodash/pick');

const WEBHOOK_ATTRS = ['active', 'url', 'firehose', 'event_types', 'certificate'];

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
            return $http.post(url(), pick(webhook, WEBHOOK_ATTRS));
        },

        ping: function () {
            return $http.post(url('ping'));
        },

        update: function (webhook) {
            return $http.put(url(webhook.id), pick(webhook, WEBHOOK_ATTRS));
        },

        delete: function (webhook) {
            return $http.delete(url(webhook.id));
        }
    };
}

apiModule.factory('Webhooks', Webhooks);
