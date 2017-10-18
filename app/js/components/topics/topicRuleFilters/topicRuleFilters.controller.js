'use strict';

var componentsModule = require('../../');

function topicRuleFilters() {
    return {
        templateUrl: 'js/components/topics/topicRuleFilters/topicRuleFilters.html',
        restrict: 'E',
        replace: false
    };
}

componentsModule.directive('topicRuleFilters', topicRuleFilters);
