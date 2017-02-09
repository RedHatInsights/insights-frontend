'use strict';

const apiModule = require('./');
const URI = require('urijs');

/**
 * @ngInject
 */
function Evaluation($http, InsightsConfig) {

    const root = InsightsConfig.apiRoot;
    const api = {};

    api.getEvaluationStatus = function () {

        const uri = URI(root).segment('evaluation').segment('status').toString();
        return $http.get(uri).then(function (res) {
            return res.data;
        });
    };

    api.activate = function (type) {

        const uri = URI(root).segment('evaluation').toString();

        return $http.post(uri, {type:type}).then(function (res) {
            return res.data;
        });
    };

    return api;
}

apiModule.factory('Evaluation', Evaluation);
