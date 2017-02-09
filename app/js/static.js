'use strict';

require('angular');
require('angular-cookies');
require('angular-gettext');

require('./services');

let requires = ['gettext', 'ngCookies', 'insights.services'];

angular.module('insights.static', requires).run(require('./boot'));

if (window.chrometwo_ready) {
    // not available in unit tests
    window.chrometwo_ready(function () {
        angular.bootstrap(document, ['insights.static']);
    });
}
