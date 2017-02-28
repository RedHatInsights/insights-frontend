'use strict';

const apiModule = require('./');
const URI = require('urijs');

/**
* @ngInject
*/
function Export($http, InsightsConfig, AccountService, $window) {
    const v3root = `${InsightsConfig.apiPrefix}v3/exports`;

    return {
        getReports: function (topic, rule, group, stale) {
            const uri = URI(v3root);
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
        }
    };
}

apiModule.factory('Export', Export);
