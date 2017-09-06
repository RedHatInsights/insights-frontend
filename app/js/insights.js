/*global require, angular*/
'use strict';

var isPortal = (typeof window.chrometwo_ready !== 'undefined');

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
require('angular-material');
require('angular-animate');

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

function megaMenuHacks() {
    var anchors = document.querySelectorAll('.tools-menu .col-sm-4:first-child a');
    [].forEach.call(anchors, function (anchor) {
        anchor.target = '_self';
    });
}

if (isPortal) {
    angular.module('insights').run(require('./portal/boot'));
    angular.module('insights').factory('Email', require('./portal/emailOptIn'));
    angular.module('insights').config(require('./portal/config'));
    angular.module('insights').config(require('./portal/base_routes'));
    angular.module('insights').config(require('./portal/routes'));
    window.chrometwo_ready(function () {
        bootstrap();
        megaMenuHacks();
    });
} else {
    angular.module('insights').config(require('./base_routes'));
}

// Common routes
angular.module('insights').config(require('./routes'));
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
        50: '90cae7',
        100: '7bc0e2',
        200: '66b6de',
        300: '51acd9',
        400: '3ca2d5',
        500: '2c96cb',
        600: '2787b6',
        700: '2377a1',
        800: '1e688c',
        900: '1a5877',
        A100: 'a5d4eb',
        A200: 'badef0',
        A400: 'cfe8f4',
        A700: '154962',
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
        50: 'f0b9b8',
        100: 'eba5a3',
        200: 'e7908e',
        300: 'e27c79',
        400: 'de6764',
        500: 'd9534f',
        600: 'd43e3a',
        700: 'c9302c',
        800: 'b42b27',
        900: 'a02622',
        A100: 'f4cecd',
        A200: 'f9e2e2',
        A400: 'fdf7f7',
        A700: '8b211e',
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
