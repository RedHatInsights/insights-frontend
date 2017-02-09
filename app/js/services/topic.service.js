'use strict';

var servicesModule = require('./');

/**
 * @ngInject
 */
function TopicService(Topic) {
    var service = {};
    var limit = 14;

    service.topics = [];

    service.reload = function (product) {
        var p = (product && product !== 'all') ? {product: product} : null;
        return Topic.getAll(p, limit).then(function (resp) {
            service.topics = resp.data;
        });
    };

    service.init = function () {
        return service.reload();
    };

    return service;
}

servicesModule.service('TopicService', TopicService);
