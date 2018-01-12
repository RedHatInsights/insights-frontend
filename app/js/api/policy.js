'use strict';

const apiModule = require('./');

const URI = require('urijs');

/**
 * @ngInject
 */
function Policy($http, AccountService, InsightsConfig) {

    const policiesUri = 'policies';
    const policyResults = 'results';
    const root = InsightsConfig.apiRoot;

    return {

        getAll (params) {
            let url = URI(root);
            url.segment(policiesUri);
            url.addSearch(AccountService.queryParam());

            if (params) {
                url.addSearch(params);
            }

            return $http.get(url.toString());
        },

        getPolicy (id) {
            let url = URI(root);
            url.segment(policiesUri);
            url.segment(id);
            url.addSearch(AccountService.queryParam());

            return $http.get(url.toString());
        },

        getPolicyResults (id, params) {
            let url = URI(root);
            url.segment(policiesUri);
            url.segment(id);
            url.segment(policyResults);
            url.addSearch(AccountService.queryParam());

            if (params) {
                url.addSearch(params);
            }

            return $http.get(url.toString());
        },

        update (id, data) {
            let url = URI(root);
            url.segment(policiesUri);
            url.segment(id);
            url.addSearch(AccountService.queryParam());
            return $http.patch(url.toString(), data);
        }
    };
}

apiModule.factory('Policy', Policy);
