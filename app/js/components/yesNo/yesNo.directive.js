'use strict';

var componentsModule = require('../');

function yesNo() {
    return {
        scope: {
            yes: '=',
            no: '=',
            text: '@'
        },
        templateUrl: 'js/components/yesNo/yesNo.html',
        restrict: 'EC'
    };
}

componentsModule.directive('yesNo', yesNo);
