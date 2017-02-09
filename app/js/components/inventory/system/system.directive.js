'use strict';

var componentsModule = require('../../');

/**
 * @ngInject
 */
function systemCtrl() {
}

function system() {
    return {
        templateUrl: 'js/components/inventory/system/system.html',
        restrict: 'E',
        replace: true,
        controller: systemCtrl
    };
}

componentsModule.directive('system', system);
