'use strict';

const componentsModule = require('../../');
const find = require('lodash/collection/find');

/**
 * @ngInject
 */
function maintenanceCategorySelectCtrl($scope, gettextCatalog, MaintenanceService) {
    $scope.plans = MaintenanceService.plans;

    $scope.options = [{
        id: 'suggested',
        label: gettextCatalog.getString('Suggestions')
    }, {
        id: 'past',
        label: gettextCatalog.getString('Past plans')
    }, {
        id: 'unscheduled',
        label: gettextCatalog.getString('Not scheduled plans')
    }, {
        id: 'future',
        label: gettextCatalog.getString('Future plans')
    }];

    $scope.select = function (option) {
        $scope.onSelect({category: option.id});
    };

    $scope.$watch('category', function (category) {
        $scope.selected = find($scope.options, {id: category});
    });
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
