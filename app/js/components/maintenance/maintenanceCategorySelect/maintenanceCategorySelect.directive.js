'use strict';

const componentsModule = require('../../');
const find = require('lodash/find');

/**
 * @ngInject
 */
function maintenanceCategorySelectCtrl($rootScope,
                                       $scope,
                                       gettextCatalog,
                                       Events,
                                       MaintenanceService) {

    const defaultCategory = 'notSuggested';

    $scope.plans = MaintenanceService.plans;

    $scope.options = [{
        id: 'notSuggested',
        label: gettextCatalog.getString('All'),
        tag: null
    }, {
        id: 'suggested',
        label: gettextCatalog.getString('Suggestions'),
        tag: gettextCatalog.getString('Maintenance: Suggestions')
    }, {
        id: 'past',
        label: gettextCatalog.getString('Past plans'),
        tag: gettextCatalog.getString('Maintenance: Past plans')
    }, {
        id: 'unscheduled',
        label: gettextCatalog.getString('Not scheduled plans'),
        tag: gettextCatalog.getString('Maintenance: Not scheduled plans')
    }, {
        id: 'future',
        label: gettextCatalog.getString('Future plans'),
        tag: gettextCatalog.getString('Maintenance: Future plans')
    }];

    $scope.select = function (option) {
        $scope.selected = option;
        $scope.onSelect({category: option.id});
        $rootScope.$broadcast(Events.filters.tag,
                             getTag(option),
                             Events.filters.maintenanceCategorySelect);
    };

    function getTag (option) {
        return option.tag;
    }

    $scope.$watch('category', function (category) {
        $scope.selected = (find($scope.options, {id: category}));
        $rootScope.$broadcast(Events.filters.tag,
                             getTag($scope.selected),
                             Events.filters.maintenanceCategorySelect);
    });

    $scope.$on(Events.filters.reset, function () {
        $scope.select(find($scope.options, {id: defaultCategory}));
    });

    $scope.$on(Events.filters.removeTag, function (event, filter) {
        if (filter === Events.filters.maintenanceCategorySelect) {
            $scope.select(find($scope.options, {id: defaultCategory}));
        }
    });

    $rootScope.$broadcast(Events.filters.tag,
                          getTag({id: defaultCategory}),
                          Events.filters.maintenanceCategorySelect);
}

function maintenanceCategorySelect() {

    return {
        templateUrl: 'js/components/maintenance/maintenanceCategorySelect/' +
            'maintenanceCategorySelect.html',
        restrict: 'E',
        controller: maintenanceCategorySelectCtrl,
        replace: true,
        scope: {
            category: '=',
            onSelect: '&'
        }
    };
}

componentsModule.directive('maintenanceCategorySelect', maintenanceCategorySelect);
