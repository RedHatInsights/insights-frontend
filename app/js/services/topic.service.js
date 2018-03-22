/*global require*/
'use strict';

const servicesModule = require('./');

/**
 * @ngInject
 */
function TopicService(Topic) {
    var service = {};
    var limit = 14;

    service.topics = [];

    service.reload = function () {
        return Topic.getAll(null, limit).then(function (resp) {
            service.topics = resp.data;
        });
    };

    service.init = function () {
        return service.reload();
    };

    return service;
}

servicesModule.service('TopicService', TopicService);
