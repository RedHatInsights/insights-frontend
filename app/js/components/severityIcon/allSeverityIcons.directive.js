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
        replace: false
    };
}

componentsModule.directive('allSeverityIcons', allSeverityIcon);
