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
require('angular-aria');
require('angular-animate');
require('angular-material');

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
    'gettext',
    'ngTable',
    'duScroll',
    'ngCookies',
    'ui.select',
    'ngSanitize',
    'ui.gravatar',
    'datePicker',
    'infinite-scroll',
    'ngAnimate',
    'ngMaterial'
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

// Angular Material Theme
angular.module('ngMaterial')
.config(function ($mdThemingProvider) {
    $mdThemingProvider.theme('default')
    .primaryPalette('blue')
    .accentPalette('grey')
    .warnPalette('red');
});

// Insights Material Theme
angular.module('ngMaterial')
.config(function ($mdThemingProvider) {

    $mdThemingProvider.definePalette('insightsPrimary', {
        50: '86e0fe',
        100: '6ddafd',
        200: '54d3fd',
        300: '3acdfd',
        400: '21c6fc',
        500: '08c0fc',
        600: '03afe8',
        700: '039cce',
        800: '0289b5',
        900: '02769c',
        A100: '9fe7fe',
        A200: 'b8edfe',
        A400: 'd2f3fe',
        A700: '026383',
        contrastDefaultColor: 'light',
        contrastDarkColors:
        ['50', '100', '200', '300', '400', 'A100'],
        contrastLightColors: undefined
    });

    $mdThemingProvider.definePalette('insightsAccent', {
        50: '8c8c8c',
        100: '999999',
        200: 'a6a6a6',
        300: 'b3b3b3',
        400: 'bfbfbf',
        500: 'cccccc',
        600: 'e6e6e6',
        700: 'f2f2f2',
        800: 'ffffff',
        900: 'ffffff',
        A100: 'e6e6e6',
        A200: 'd9d9d9',
        A400: 'cccccc',
        A700: 'ffffff',
        contrastDefaultColor: 'light',
        contrastDarkColors:
        ['50', '100', '200', '300', '400', 'A100'],
        contrastLightColors: undefined
    });

    $mdThemingProvider.definePalette('insightsWarn', {
        50: 'ff4d4d',
        100: 'ff3333',
        200: 'ff1a1a',
        300: 'ff0000',
        400: 'e60000',
        500: 'cc0000',
        600: 'b30000',
        700: '990000',
        800: '800000',
        900: '660000',
        A100: 'ff6666',
        A200: 'ff8080',
        A400: 'ff9999',
        A700: '4d0000',
        contrastDefaultColor: 'light',
        contrastDarkColors:
        ['50', '100', '200', '300', '400', 'A100'],
        contrastLightColors: undefined
    });

    $mdThemingProvider.theme('default')
        .primaryPalette('insightsPrimary')
        .accentPalette('insightsAccent')
        .warnPalette('insightsWarn');

});
