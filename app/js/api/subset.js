'use strict';

const apiModule = require('./');
const URI = require('urijs');

/**
* @ngInject
*/
function Subset($http, InsightsConfig, AccountService, DataUtils) {
    const root = InsightsConfig.apiRoot;

    return {
        create: function (branch_id, system_ids) {
            const uri = URI(root);
            uri.segment('subsets');
            uri.addSearch(AccountService.queryParam());

            return $http.post(uri.toString(), {
                branch_id,
                system_ids
            });
        },

        getRulesWithHits: function (subset) {
            const uri = URI(root);
            uri.segment('subsets');
            uri.segment(subset);
            uri.segment('rules');
            uri.addSearch('report_count', 'gt0');
            uri.addSearch(AccountService.queryParam());

            return $http.get(uri.toString()).success(function (result) {
                result.resources.forEach(DataUtils.readRule);
            });
        }
    };
}

apiModule.factory('Subset', Subset);
