'use strict';

const componentsModule = require('../../');
const find = require('lodash/find');

/**
 * @ngInject
 */
function maintenanceCategorySelectCtrl($location, $timeout,
                                       $rootScope,
                                       $scope,
                                       gettextCatalog,
                                       Events,
                                       MaintenanceService) {
    const DEFAULT_CATEGORY = 'all';

    $scope.options = [{
        id: 'all',
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

    $scope.plans = MaintenanceService.plans;

    $scope.select = function (option) {
        if (option && option.id) {
            $scope.selected = option;

            if (option.id === DEFAULT_CATEGORY) {
                $location.search('maintenanceCategory', null);
            } else {
                $location.search('maintenanceCategory', option.id);
            }

            $scope.onSelect({category: option.id});
            $rootScope.$broadcast(Events.filters.tag,
                getTag(option),
                Events.filters.maintenanceCategorySelect);
        }
    };

    function getTag (option) {
        return option.tag;
    }

    $scope.$on(Events.filters.reset, function () {
        $scope.select(find($scope.options, {id: DEFAULT_CATEGORY}));
    });

    $scope.$on(Events.filters.removeTag, function (event, filter) {
        if (filter === Events.filters.maintenanceCategorySelect) {
            $scope.select(find($scope.options, {id: DEFAULT_CATEGORY}));
        }
    });

    $scope.select(find($scope.options, {id: $scope.category}));
}

function maintenanceCategorySelect() {

    return {
        templateUrl: 'js/components/filterComponents/maintenanceCategorySelect/' +
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
