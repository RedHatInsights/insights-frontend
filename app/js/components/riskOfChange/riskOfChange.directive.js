/*global require*/
'use strict';

const componentsModule = require('../');

function riskOfChange() {
    return {
        scope: {
            changeRisk: '<',
            hideLabel: '<'
        },
        templateUrl: 'js/components/riskOfChange/riskOfChange.html',
        restrict: 'E',
        replace: true
    };
}

componentsModule.directive('riskOfChange', riskOfChange);
