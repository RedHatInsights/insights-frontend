'use strict';

var componentsModule = require('../../');

/**
 * @ngInject
 */
function hideIgnoredToggleCtrl() {
}

function hideIgnoredToggle() {
    return {
        templateUrl:
            'js/components/filterComponents/hideIgnoredToggle/hideIgnoredToggle.html',
        restrict: 'E',
        controller: hideIgnoredToggleCtrl
    };
}

componentsModule.directive('hideIgnoredToggle', hideIgnoredToggle);
