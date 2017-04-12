'use strict';

const apiModule = require('./');
const URI = require('urijs');

/**
 * @ngInject
 */
function Blog($http) {
    const api = {};

    api.subscribe = function () {

        const uri = URI('/api')
            .segment('redhat_node')
            .segment('2184921')
            .segment('subscribe')
            .toString();

        return $http.post(uri).then(res => res.data);
    };

    return api;
}

apiModule.factory('Blog', Blog);
