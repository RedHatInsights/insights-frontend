/*global require*/
'use strict';

var componentsModule = require('../../');

/**
 * @ngInject
 */
function buttonSplitController() {  }

/**
 * @ngInject
 */
function buttonSplit() {
    return {
        templateUrl: 'js/components/buttons/button-split/button-split.html',
        restrict: 'E',
        replace: false,
        controller: buttonSplitController,
        scope: {
            dropDown: '@'
        }
    };
}

/**
 * @ngInject
 */
function buttonSplitButton() {
    return {
        templateUrl: 'js/components/buttons/button-split/button-split-button.html',
        restrict: 'E',
        replace: true,
        transclude: true,
        require: '^buttonSplit'
    };
}

/**
 * @ngInject
 */
function buttonSplitDropdown() {
    return {
        templateUrl: 'js/components/buttons/button-split/button-split-dropdown.html',
        restrict: 'E',
        replace: true,
        transclude: true,
        require: '^buttonSplit'
    };
}

componentsModule.directive('buttonSplit', buttonSplit);
componentsModule.directive('buttonSplitDropdown', buttonSplitDropdown);
componentsModule.directive('buttonSplitButton',  buttonSplitButton);
