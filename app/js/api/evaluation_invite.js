'use strict';

const apiModule = require('./');
const URI = require('urijs');

/**
 * @ngInject
 */
function EvaluationInvite($http, InsightsConfig) {

    const root = InsightsConfig.apiRoot;
    const api = {};

    api.create = function (invite) {

        const uri = URI(root).segment('evaluation_invite').toString();

        return $http.post(uri, invite).then(function (res) {
            return res.data;
        });
    };

    api.getAll = function () {

        const uri = URI(root).segment('evaluation_invite').toString();

        return $http.get(uri).then(function (res) {
            return res.data;
        });
    };

    return api;
}

apiModule.factory('EvaluationInvite', EvaluationInvite);
