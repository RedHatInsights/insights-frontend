'use strict';

var componentsModule = require('../../');

/**
 * @ngInject
 */
function ruleHitTriStateCtrl($scope,
                             $location,
                             $rootScope,
                             Events,
                             RuleHitFilters) {

    const DEFAULT_RULE_HIT = 'all';

    $scope.RuleHitFilters = RuleHitFilters;

    $scope.filterRuleHit = function (key) {
        $scope.ruleHit = key;

        if (key === DEFAULT_RULE_HIT) {
            delete $location.search()[Events.filters.ruleHit];
        } else {
            $location.search()[Events.filters.ruleHit] = key;
        }

        $rootScope.$broadcast(Events.filters.tag, getTag(), Events.filters.ruleHit);
        $rootScope.$broadcast(Events.filters.ruleHit, key);
    };

    function getTag() {
        return RuleHitFilters[$scope.ruleHit].tag;
    }

    function resetFilter() {
        $scope.filterRuleHit(DEFAULT_RULE_HIT);
    }

    (function init() {
        $scope.ruleHit = $location.search()[Events.filters.ruleHit] || DEFAULT_RULE_HIT;
        $rootScope.$broadcast(Events.filters.tag, getTag(), Events.filters.ruleStatus);
    })();

    $scope.$on(Events.filters.reset, function () {
        resetFilter();
    });

    $scope.$on(Events.filters.removeTag, function (event, filter) {
        if (filter === Events.filters.ruleHit) {
            resetFilter();
        }
    });
}

function ruleHitTriState() {
    return {
        templateUrl:
            'js/components/filterComponents/ruleHitTriState/ruleHitTriState.html',
        restrict: 'E',
        replace: true,
        controller: ruleHitTriStateCtrl
    };
}

componentsModule.directive('ruleHitTriState', ruleHitTriState);
