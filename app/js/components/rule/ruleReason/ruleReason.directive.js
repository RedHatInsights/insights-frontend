'use strict';

var componentsModule = require('../../');

/**
 * @ngInject
 */
function ruleReason() {
    return {
        templateUrl: 'js/components/rule/ruleReason/ruleReason.html',
        restrict: 'EC'
    };
}

componentsModule.directive('ruleReason', ruleReason);
