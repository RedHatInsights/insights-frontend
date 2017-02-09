'use strict';

var componentsModule = require('../');

function ruleStateIcon() {
    return {
        scope: {
            state: '='
        },
        templateUrl: 'js/components/ruleStateIcon/ruleStateIcon.html',
        restrict: 'E',
        replace: true
    };
}

componentsModule.directive('ruleStateIcon', ruleStateIcon);
