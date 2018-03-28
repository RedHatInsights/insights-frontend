/*global require*/
'use strict';

const componentsModule = require('../');

function mlReliabilityIcons () {
    return {
        scope: {
            rule: '<'
        },
        templateUrl: 'js/components/severityIcon/mlReliabilityIcons.html',
        restrict: 'E',
        replace: true
    };
}

componentsModule.directive('mlReliabilityIcons', mlReliabilityIcons);
