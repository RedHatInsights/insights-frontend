/*global require*/
'use strict';

const componentsModule = require('../');

function mlSeverityIcons () {
    return {
        scope: {
            rule: '<'
        },
        templateUrl: 'js/components/severityIcon/mlSeverityIcons.html',
        restrict: 'E',
        replace: true
    };
}

componentsModule.directive('mlSeverityIcons', mlSeverityIcons);
