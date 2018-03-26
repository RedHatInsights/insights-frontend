'use strict';

var componentsModule = require('../');

/**
 * @ngInject
 */
function pinCtrl() {
}

function pin() {
    return {
        templateUrl: 'js/components/pin/pin.html',
        restrict: 'E',
        replace: false,
        controller: pinCtrl
    };
}

componentsModule.directive('pin', pin);
