'use strict';

var apiModule = require('./');

/**
 * @ngInject
 */
function Account($http, InsightsConfig, AccountService) {
    var root = InsightsConfig.apiRoot;

    return {
        getProducts: function () {
            var url = root + 'account/products' + AccountService.current();
            return $http.get(url);
        }
    };
}

apiModule.factory('Account', Account);
