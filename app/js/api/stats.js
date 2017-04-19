'use strict';

const apiModule = require('./');
const URI = require('urijs');

/**
* @ngInject
*/
function Stats($http, InsightsConfig, AccountService, Group) {
    function buildUri (segment, params, ignoreGroup) {
        const uri = URI(InsightsConfig.apiRoot);
        uri.segment('stats');

        if (segment) {
            uri.segment(segment);
        }

        uri.addSearch(AccountService.queryParam());

        if (!ignoreGroup) {
            uri.addSearch(Group.queryParam());
        }

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

        getRules: function (params, ignoreGroup) {
            return $http.get(buildUri('rules', params, ignoreGroup));
        }
    };
}

apiModule.factory('Stats', Stats);
