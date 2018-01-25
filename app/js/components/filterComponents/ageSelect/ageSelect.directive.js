/*global require*/
'use strict';

const componentsModule = require('../../');

/**
 * @ngInject
 */
function ageSelectCtrl($location,
                            $rootScope,
                            $scope,
                            gettextCatalog,
                            Events,
                       FilterService) {

    $scope.options = {
        0: {
            label: gettextCatalog.getString('All'),
            tag: null
        },
        1: {
            label: gettextCatalog.getString('Today'),
            tag: gettextCatalog.getString('Age: Today')
        }
    };

    for (let len of [7, 15, 30, 90]) {
        $scope.options[len] = {
            label: gettextCatalog.getString(`Last ${len} Days`),
            tag: gettextCatalog.getString(`Age: ${len} Days`)
        };
    }

    $scope.select = function (option) {
        $scope.selected = $scope.options[option];
        FilterService.setAge(option);
        FilterService.doFilter();

        $rootScope.$broadcast(Events.filters.tag,
                              $scope.selected.tag,
                              Events.filters.age);
    };

    function read() {
        const age = $location.search()[Events.filters.age] || FilterService.getAge();
        $scope.selected = $scope.options[age] || $scope.options[0];
        $rootScope.$broadcast(Events.filters.tag,
                              $scope.selected.tag,
                              Events.filters.age);
    }

    read();

    $scope.$on(Events.filters.reset, function () {
        $scope.select(0);
    });

    $scope.$on(Events.filters.removeTag, function (event, filter) {
        if (filter === Events.filters.age) {
            $scope.select(0);
        }
    });
}

function ageSelect() {
    return {
        templateUrl: 'js/components/filterComponents/ageSelect/ageSelect.html',
        restrict: 'E',
        controller: ageSelectCtrl,
        scope: {}
    };
}

componentsModule.directive('ageSelect', ageSelect);
