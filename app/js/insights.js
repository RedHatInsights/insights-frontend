/*global require, angular*/
'use strict';

// check the global var before the InsightsConfig stuff is loaded
let isPortal = false;
if (window && window.insightsGlobal && window.insightsGlobal.isSaas) {
    // ^ this complicated jibba jabba unless tests break
    isPortal = true;
}

if (typeof window.angular === 'undefined') {
    // No angular found on window, pull it in.
    require('angular');
}

// angular modules
require('angular-resource');
require('angular-animate');
require('angular-ui-router');
require('angular-sanitize');
require('angular-scroll');
require('angular-gettext');
require('angular-cookies');
require('ui-select');
require('angular-gravatar');
require('ng-table');
require('angular-datepicker');
require('ng-infinite-scroll');

require('./components/ui-bootstrap-custom');

// app modules
require('./api');
require('./services');
require('./constants');
require('./providers');
require('./states');
require('./components');
require('./templates');

let requires = [
    'insights.api',
    'insights.services',
    'insights.constants',
    'insights.providers',
    'insights.components',
    'insights.states',
    'insights.templates',
    'ui.router',
    'ui.bootstrap',
    'ngResource',
    'ngAnimate',
    'gettext',
    'ngTable',
    'duScroll',
    'ngCookies',
    'ui.select',
    'ngSanitize',
    'ui.gravatar',
    'datePicker',
    'infinite-scroll'
];

if (isPortal) {
    require('angular-loading-bar');
    requires.push('angular-loading-bar');
}

angular.module('insights', requires);
angular.module('insights').value('duScrollBottomSpy', true);

function bootstrap() {
    angular.bootstrap(document, ['insights']);
}

function whenDomReady(fn) {
    if (document.readyState === 'complete') {
        fn();
        return;
    }

    document.addEventListener('DOMContentLoaded', fn, false);
}

if (isPortal) {
    angular.module('insights').run(require('./portal/boot'));
    angular.module('insights').factory('Email', require('./portal/emailOptIn'));
    angular.module('insights').config(require('./portal/config'));
    angular.module('insights').config(require('./portal/base_routes'));
    angular.module('insights').config(require('./portal/routes'));
    whenDomReady(bootstrap);
} else {
    angular.module('insights').config(require('./base_routes'));
}

angular.module('insights').run(require('./boot'));

// Common routes
angular.module('insights').config(require('./routes'));

// Load the Angular config
angular.module('insights').config(require('./config'));

// workaround for https://github.com/angular-ui/ui-select/issues/1560
angular.module('ui.select').run(function ($animate) {
    const overridden = $animate.enabled;
    $animate.enabled = function (elem) {
        if (elem.hasOwnProperty('length') && elem.length === 1) {
            elem = elem[0];
        }

        if (elem && elem.className.includes('ui-select-choices')) {
            return false;
        }

        return overridden(elem);
    };
});
