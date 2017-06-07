'use strict';

var componentsModule = require('../../');

/**
 * @ngInject
 */
function topicRuleFiltersCtrl($location, $scope, Events) {

    $scope.tags = {};

    function initTags () {
        addTag(Events.filters.incident);
        addTag(Events.filters.totalRisk);
    }

    function addTag (tag) {
        let value = $location.search()[tag];

        if (value) {
            $scope.tags[tag] = value;
        }
    }

    initTags();
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
