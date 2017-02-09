/*global require*/
'use strict';

var servicesModule = require('./');

/**
 * @ngInject
 */
function OverviewService(Article) {
    var pub = {};
    pub.loading = false;

    function load() {
        Article.get().then(function (res) {
            pub.article = res.data;
        });
    }

    pub.update = function (id, data) {
        return Article.update(id, data).then(load);
    };

    load();

    return pub;
}

servicesModule.factory('OverviewService', OverviewService);
