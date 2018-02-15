'use strict';

var componentsModule = require('../../');

function insButtonCtrl ($scope) {
    $scope.styles = {
        primary: 'md-primary md-raised',
        secondary: 'md-accent md-raised',
        ghost: 'md-primary md-ghost',
        clear: 'clear'
    };
}

function insButton() {
    return {
        scope: {
            type: '@',
            size: '@',
            disabled: '@',
            icon:'@'
        },
        transclude: true,
        templateUrl: 'js/components/buttons/ins-buttons/ins-button.html',
        restrict: 'E',
        replace: true,
        controller: insButtonCtrl
    };
}

function insButtonFab() {
    return {
        scope: {
            type: '@',
            size: '@',
            disabled: '@',
            icon:'@'
        },
        transclude: true,
        templateUrl: 'js/components/buttons/ins-buttons/ins-button-fab.html',
        restrict: 'E',
        replace: true,
        controller: insButtonCtrl
    };
}

componentsModule.directive('insButton', insButton);
componentsModule.directive('insButtonFab', insButtonFab);
