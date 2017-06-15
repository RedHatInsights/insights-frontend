'use strict';

var componentsModule = require('../../');

/**
 * @ngInject
 */
function topicRuleFiltersCtrl() {

}

function topicRuleFilters() {
    return {
        templateUrl: 'js/components/topics/topicRuleFilters/topicRuleFilters.html',
        restrict: 'E',
        replace: true,
        controller: topicRuleFiltersCtrl
    };
}

componentsModule.directive('topicRuleFilters', topicRuleFilters);
