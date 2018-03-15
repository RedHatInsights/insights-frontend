'use strict';

var componentsModule = require('../');

/**
 * @ngInject
 */
function pfStatusIconCtrl() {
}

function pfStatusIcon() {
    return {
        scope: {
            status: '='
        },
        templateUrl: 'js/components/pfStatusIcon/pfStatusIcon.html',
        restrict: 'E',
        replace: true,
        controller: pfStatusIconCtrl
    };
}

componentsModule.directive('pfStatusIcon', pfStatusIcon);
