'use strict';

const componentsModule = require('../../');
const find = require('lodash/collection/find');

/**
 * @ngInject
 */
function actionsSelectCtrl($scope,
                           gettextCatalog,
                           Events,
                           MultiButtonService,
                           FilterService) {
    $scope.options = [
        {
            id: 'all',
            label: gettextCatalog.getString('All'),
            withActions: true,
            withoutActions: true
        }, {
            id: 'affected',
            label: gettextCatalog.getString('Affected'),
            withActions: true,
            withoutActions: false
        }, {
            id: 'healthy',
            label: gettextCatalog.getString('Healthy'),
            withActions: false,
            withoutActions: true
        }
    ];

    $scope.select = function (option) {
        $scope.selected = option;
        MultiButtonService.setState('inventoryWithActions', option.withActions);
        MultiButtonService.setState('inventoryWithoutActions', option.withoutActions);
        FilterService.doFilter();
    };

    function read () {
        $scope.selected = find($scope.options, {
            withActions: MultiButtonService.getState('inventoryWithActions'),
            withoutActions: MultiButtonService.getState('inventoryWithoutActions')
        });
        if (!$scope.selected) {
            throw new Error('Invalid system health selector state: ' +
                MultiButtonService.getState('inventoryWithActions') + ':' +
                MultiButtonService.getState('inventoryWithoutActions'));
        }
    }

    read();

    $scope.$on(Events.filters.reset, function () {
        $scope.select(find($scope.options, (option) => {
            return option.id === 'all';
        }));
    });
}

function actionsSelect() {
    return {
        templateUrl: 'js/components/filterComponents/actionsSelect/actionsSelect.html',
        restrict: 'E',
        controller: actionsSelectCtrl,
        scope: {}
    };
}

componentsModule.directive('actionsSelect', actionsSelect);
