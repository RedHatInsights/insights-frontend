'use strict';

const apiModule = require('./');
const URI = require('urijs');
const pick = require('lodash/pick');

const WEBHOOK_ATTRS =
    ['active', 'url', 'firehose', 'event_types', 'certificate', 'group_id'];

/**
 * @ngInject
 */
function Webhooks($http, AccountService, InsightsConfig) {
    const root = InsightsConfig.apiRoot;

    function url (id) {
        const url = URI(root);
        url.segment('webhooks');
        if (id) {
            url.segment(String(id));
        }

        url.addSearch(AccountService.queryParam());
        return url;
    }

    return {

        get: function (id, includeStatus = true) {
            const builder = url(id);
            if (includeStatus) {
                builder.addSearch('include', 'status');
            }

            return $http.get(builder.toString());
        },

        create: function (webhook) {
            return $http.post(url().toString(), pick(webhook, WEBHOOK_ATTRS));
        },

        ping: function () {
            return $http.post(url('ping').toString());
        },

        update: function (webhook) {
            return $http.put(url(webhook.id).toString(), pick(webhook, WEBHOOK_ATTRS));
        },

        delete: function (webhook) {
            return $http.delete(url(webhook.id).toString());
        }
    };
}

apiModule.factory('Webhooks', Webhooks);
