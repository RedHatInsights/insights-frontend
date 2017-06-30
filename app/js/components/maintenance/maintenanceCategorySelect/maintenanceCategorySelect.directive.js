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

    let ogCategory = $scope.category;

    $scope.plans = MaintenanceService.plans;

    $scope.options = [{
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
        $scope.onSelect({category: option.id});
        $rootScope.$broadcast(Events.filters.tag,
                             getTag(option),
                             Events.filters.maintenanceCategorySelect);
    };

    function getTag (option) {
        return find($scope.options, {id: option.id}).tag;
    }

    $scope.$watch('category', function (category) {
        $scope.selected = find($scope.options, {id: category});
    });

    $scope.$on(Events.filters.reset, function () {
        $scope.select(find($scope.options, {id: ogCategory}));
    });

    $scope.$on(Events.filters.removeTag, function (event, filter) {
        if (filter === Events.filters.maintenanceCategorySelect) {
            $scope.select(find($scope.options, {id: ogCategory}));
        }
    });

    $rootScope.$broadcast(Events.filters.tag,
                          getTag({id: ogCategory}),
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
