'use strict';

var componentsModule = require('../');

/**
 * @ngInject
 */
function severityNumbers() {
    return {
        templateUrl: 'js/components/severityNumbers/severityNumbers.html',
        restrict: 'E',
        replace: true,
        scope: {
            rule: '='
        }
    };
}

componentsModule.directive('severityNumbers', severityNumbers);
