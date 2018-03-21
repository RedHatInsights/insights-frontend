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
    if (document.readyState !== 'loading') {
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
    angular.module('insights').config(require('./portal/redirects'));
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
        50: '64e2ff',
        100: '4bddff',
        200: '31d8ff',
        300: '18d3ff',
        400: '00cefd',
        500: '00b7ff',
        600: '00a4ca',
        700: '0090b1',
        800: '007b97',
        900: '00667e',
        A100: '7ee7ff',
        A200: '97ebff',
        A400: 'b1f0ff',
        A700: '005264',
        contrastDefaultColor: 'light',
        contrastDarkColors:
        ['50', '100', '200', '300', '400', 'A100'],
        contrastLightColors: undefined
    });

    $mdThemingProvider.definePalette('insightsAccent', {
        50: '4c4c4c',
        100: '9c9c9c',
        200: 'a9a9a9',
        300: 'b6b6b6',
        400: 'c2c2c2',
        500: 'cfcfcf',
        600: 'e9e9e9',
        700: 'f5f5f5',
        800: 'ffffff',
        900: 'ffffff',
        A100: 'e9e9e9',
        A200: 'dcdcdc',
        A400: 'cfcfcf',
        A700: 'ffffff',
        contrastDefaultColor: 'light',
        contrastDarkColors:
        ['200', '300', '400', 'A100'],
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
        .primaryPalette('insightsPrimary', {
            default: '500',
            'hue-1': '100',
            'hue-2': '800',
            'hue-3': 'A100'
        })
        .accentPalette('insightsAccent', {
            default: '500',
            'hue-1': '50',
            'hue-2': '200',
            'hue-3': '800'
        })
        .warnPalette('insightsWarn', {
            default: '500',
            'hue-1': '100',
            'hue-2': '800',
            'hue-3': 'A100'
        });
});
