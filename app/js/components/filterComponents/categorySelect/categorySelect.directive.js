'use strict';

const componentsModule = require('../../');

/**
 * @ngInject
 */
function categorySelectCtrl($location,
                            $rootScope,
                            $scope,
                            gettextCatalog,
                            Events,
                            FilterService) {
    $scope.options = {
        all: {
            label: gettextCatalog.getString('All'),
            tag: null
        },
        availability: {
            label: gettextCatalog.getString('Availability'),
            tag: gettextCatalog.getString('Category: Availability')
        },
        stability: {
            label: gettextCatalog.getString('Stability'),
            tag: gettextCatalog.getString('Category: Stability')
        },
        performance: {
            label: gettextCatalog.getString('Performance'),
            tag: gettextCatalog.getString('Category: Performance')
        },
        security: {
            label: gettextCatalog.getString('Security'),
            tag: gettextCatalog.getString('Category: Security')
        }
    };

    $scope.select = function (option) {
        $scope.selected = $scope.options[option];
        FilterService.setCategory(option);
        FilterService.doFilter();
        $rootScope.$broadcast(Events.filters.tag,
                              getTag(),
                              Events.filters.categorySelect);
    };

    function getTag () {
        return $scope.selected.tag;
    }

    function read() {
        let category = $location.search().category ?
            $location.search().category : FilterService.getCategory();

        $scope.selected = $scope.options[category];
        $rootScope.$broadcast(Events.filters.tag,
                              getTag(),
                              Events.filters.categorySelect);
    }

    read();

    $scope.$on(Events.filters.reset, function () {
        $scope.select('all');
    });

    $scope.$on(Events.filters.removeTag, function (event, filter) {
        if (filter === Events.filters.categorySelect) {
            $scope.select('all');
        }
    });
}

function categorySelect() {
    return {
        templateUrl: 'js/components/filterComponents/categorySelect/categorySelect.html',
        restrict: 'E',
        controller: categorySelectCtrl,
        scope: {}
    };
}

componentsModule.directive('categorySelect', categorySelect);
