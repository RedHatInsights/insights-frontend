/*global require*/
'use strict';

const componentsModule = require('../');

function allSeverityIcon () {
    return {
        scope: {
            rule: '<'
        },
        templateUrl: 'js/components/severityIcon/allSeverityIcons.html',
        restrict: 'E',
        replace: true
    };
}

componentsModule.directive('allSeverityIcons', allSeverityIcon);
