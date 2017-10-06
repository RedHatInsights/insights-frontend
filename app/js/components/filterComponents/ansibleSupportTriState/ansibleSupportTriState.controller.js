'use strict';

var componentsModule = require('../../');

/**
 * @ngInject
 */
function ansibleSupportTriStateCtrl($location,
                                    $rootScope,
                                    $scope,
                                    Events,
                                    FilterService,
                                    AnsibleSupportFilters) {

    $scope.AnsibleSupportFilters = AnsibleSupportFilters;

    $scope.filterAnsibleSupport = function (key) {
        $scope.showAnsibleSupport = key;
        FilterService.setAnsibleSupport(key);
        FilterService.doFilter();

        // If 'All' is selected there is no reason to store the filter
        if ($scope.showAnsibleSupport === 'all') {
            $location.search(Events.filters.ansibleSupport, null);
        } else {
            $location.search(Events.filters.ansibleSupport, $scope.showAnsibleSupport);
        }

        $rootScope.$broadcast(Events.filters.tag, getTag(),
                              Events.filters.ansibleSupport);
        $rootScope.$broadcast(Events.filters.ansibleSupport, $scope.showAnsibleSupport);
    };

    $scope.$on(Events.filters.reset, function () {
        resetFilter();
    });

    $scope.$on(Events.filters.removeTag, function (event, filter) {
        if (filter === Events.filters.ansibleSupport) {
            resetFilter();
            $rootScope.$broadcast(filter, 'all');
        }
    });

    function resetFilter () {
        $scope.showAnsibleSupport = 'all';
        $scope.filterAnsibleSupport($scope.showAnsibleSupport);
        $location.search(Events.filters.ansibleSupport, null);
    }

    function getTag () {
        let tag = AnsibleSupportFilters[$scope.showAnsibleSupport].tag;

        return tag;
    }

    function init () {
        $scope.showAnsibleSupport = $location.search()[Events.filters.ansibleSupport] ?
            $location.search()[Events.filters.ansibleSupport] :
            FilterService.getAnsibleSupport();

        $rootScope.$broadcast(Events.filters.tag, getTag(),
                              Events.filters.ansibleSupport);
    }

    init();
}

function ansibleSupportTriState() {
    return {
        templateUrl:
            'js/components/filterComponents/ansibleSupportTriState' +
            '/ansibleSupportTriState.html',
        restrict: 'E',
        controller: ansibleSupportTriStateCtrl
    };
}

componentsModule.directive('ansibleSupportTriState', ansibleSupportTriState);
