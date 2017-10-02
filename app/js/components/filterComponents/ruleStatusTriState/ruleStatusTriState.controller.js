'use strict';

var componentsModule = require('../../');

/**
 * @ngInject
 */
function ruleStatusTriStateCtrl($location,
                                $rootScope,
                                $scope,
                                Events,
                                RuleStatusFilters,
                                FilterService) {

    $scope.RuleStatusFilters = RuleStatusFilters;

    $scope.filterRuleStatus = function (key) {
        $scope.showRuleStatus = key;

        FilterService.setRuleStatus(key);
        FilterService.doFilter();

        // no need to store filter when
        // not filtering ignored/unignored rules
        if (key === 'all') {
            $location.search(Events.filters.ruleStatus, null);
        } else {
            $location.search(Events.filters.ruleStatus, $scope.showRuleStatus);
        }

        $rootScope.$broadcast(Events.filters.tag, getTag(), Events.filters.ruleStatus);
        $rootScope.$broadcast(Events.filters.ruleStatus, $scope.showRuleStatus);
    };

    $scope.$on(Events.filters.reset, function () {
        resetFilter();
    });

    $scope.$on(Events.filters.removeTag, function (event, filter) {
        if (filter === Events.filters.ruleStatus) {
            resetFilter();
            $rootScope.$broadcast(filter, 'all');
        }
    });

    function resetFilter () {
        $scope.filterRuleStatus('all');
    }

    function getTag () {
        let tag = RuleStatusFilters[$scope.showRuleStatus].tag;

        return tag;
    }

    function init () {
        $scope.showRuleStatus = $location.search()[Events.filters.ruleStatus] ?
            $location.search()[Events.filters.ruleStatus] : FilterService.getRuleStatus();

        $rootScope.$broadcast(Events.filters.tag, getTag(), Events.filters.ruleStatus);
    }

    init();
}

function ruleStatusTriState() {
    return {
        templateUrl:
            'js/components/filterComponents/ruleStatusTriState/ruleStatusTriState.html',
        restrict: 'E',
        controller: ruleStatusTriStateCtrl
    };
}

componentsModule.directive('ruleStatusTriState', ruleStatusTriState);
