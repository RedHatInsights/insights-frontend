'use strict';

const apiModule = require('./');
const URI = require('urijs');

/**
* @ngInject
*/
function Stats($http, InsightsConfig, AccountService, Group) {
    function buildUri (segment, params) {
        const uri = URI(InsightsConfig.apiRoot);
        uri.segment('stats');

        if (segment) {
            uri.segment(segment);
        }

        uri.addSearch(AccountService.queryParam());
        uri.addSearch(Group.queryParam());

        if (params) {
            uri.addSearch(params);
        }

        return uri.toString();
    }

    return {
        getAll: function (params) {
            return $http.get(buildUri(null, params));
        },

        getSystems: function (params) {
            return $http.get(buildUri('systems', params));
        },

        getRules: function (params) {
            return $http.get(buildUri('rules', params));
        }
    };
}

apiModule.factory('Stats', Stats);
