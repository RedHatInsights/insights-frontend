'use strict';

const componentsModule = require('../../');

/**
 * @ngInject
 */
function likelihoodSelectCtrl($location,
                            $rootScope,
                            $scope,
                            LikelihoodFilters,
                            Events,
                            FilterService) {
    $scope.options = LikelihoodFilters;

    $scope.select = function (option) {
        $scope.selected = $scope.options[option];
        FilterService.setLikelihood(option);
        FilterService.doFilter();

        // no need to store filter when not filtering rules.
        if (option === 0) {
            $location.search(Events.filters.likelihood, null);
        } else {
            $location.search(Events.filters.likelihood, option);
        }

        $rootScope.$broadcast(Events.filters.tag,
                              getTag(),
                              Events.filters.likelihood);
        $rootScope.$broadcast(Events.filters.likelihood);
    };

    function getTag () {
        return $scope.selected.tag;
    }

    function init() {
        let option = $location.search()[Events.filters.likelihood] ?
            $location.search()[Events.filters.likelihood] :
            FilterService.getLikelihood();

        $scope.selected = $scope.options[option];
        $rootScope.$broadcast(Events.filters.tag,
                              getTag(),
                              Events.filters.likelihood);
    }

    init();

    $scope.$on(Events.filters.reset, function () {
        $scope.select(0);
    });

    $scope.$on(Events.filters.removeTag, function (event, filter) {
        if (filter === Events.filters.likelihood) {
            $scope.select(0);
        }
    });
}

function likelihoodSelect() {
    return {
        templateUrl: 'js/components/filterComponents/likelihoodSelect/' +
                     'likelihoodSelect.html',
        restrict: 'E',
        controller: likelihoodSelectCtrl,
        scope: {}
    };
}

componentsModule.directive('likelihoodSelect', likelihoodSelect);
