'use strict';

var componentsModule = require('../../');

function ruleFilter() {
    return {
        templateUrl: 'js/components/rule/ruleFilter/ruleFilter.html',
        restrict: 'E'
    };
}

componentsModule.directive('ruleFilter', ruleFilter);
