'use strict';

var componentsModule = require('../../');

function insButton() {
    return {
        scope: {
            color: '@',
            type: '@',
            size: '@',
            disabled: '@',
            icon:'@'
        },
        transclude: true,
        templateUrl: 'js/components/buttons/ins-buttons/ins-button.html',
        restrict: 'E',
        replace: true
    };
}

function insButtonFab() {
    return {
        scope: {
            color: '@',
            type: '@',
            size: '@',
            disabled: '@',
            icon:'@'
        },
        transclude: true,
        templateUrl: 'js/components/buttons/ins-buttons/ins-button-fab.html',
        restrict: 'E',
        replace: true
    };
}

componentsModule.directive('insButton', insButton);
componentsModule.directive('insButtonFab', insButtonFab);
