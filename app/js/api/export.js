'use strict';

const apiModule = require('./');
const URI = require('urijs');

/**
* @ngInject
*/
function Export($http, InsightsConfig, AccountService, $window) {

    return {
        getReports: function (topic, rule, group, stale) {
            const uri = URI(InsightsConfig.apiRoot);
            uri.segment('reports');

            if (topic) {
                uri.addSearch('topic', topic);
            }

            if (rule) {
                uri.addSearch('rules', rule);
            }

            if (group) {
                uri.addSearch('group', group);
            }

            if (stale !== undefined) {
                uri.addSearch('stale', stale);
            }

            uri.addSearch(AccountService.queryParam());
            $window.location.assign(uri.toString());
        },

        getSystems: function (group, stale, search) {
            const uri = URI(InsightsConfig.apiRoot);
            uri.segment('systems');

            if (group) {
                uri.addSearch('group', group);
            }

            if (stale !== undefined) {
                uri.addSearch('stale', stale);
            }

            if (search) {
                uri.addSearch('search', search);
            }

            uri.addSearch(AccountService.queryParam());
            $window.location.assign(uri.toString());
        }
    };
}

apiModule.factory('Export', Export);
