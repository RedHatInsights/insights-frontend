'use strict';

const componentsModule = require('../../');
const find = require('lodash/find');

/**
 * @ngInject
 */
function actionsSelectCtrl($rootScope,
                           $scope,
                           gettextCatalog,
                           Events,
                           MultiButtonService,
                           FilterService) {
    $scope.options = [
        {
            id: 'all',
            label: gettextCatalog.getString('All'),
            withActions: true,
            withoutActions: true,
            tag: null
        }, {
            id: 'affected',
            label: gettextCatalog.getString('Affected'),
            withActions: true,
            withoutActions: false,
            tag: gettextCatalog.getString('Health: Affected')
        }, {
            id: 'healthy',
            label: gettextCatalog.getString('Healthy'),
            withActions: false,
            withoutActions: true,
            tag: gettextCatalog.getString('Health: Healthy')
        }
    ];

    $scope.select = function (option) {
        $scope.selected = option;
        MultiButtonService.setState('inventoryWithActions', option.withActions);
        MultiButtonService.setState('inventoryWithoutActions', option.withoutActions);
        FilterService.doFilter();
        $rootScope.$broadcast(Events.filters.tag, getTag(), Events.filters.actionsSelect);
    };

    function getTag () {
        return $scope.selected.tag;
    }

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

        $rootScope.$broadcast(Events.filters.tag, getTag(), Events.filters.actionsSelect);
    }

    read();

    $scope.$on(Events.filters.reset, function () {
        $scope.select(find($scope.options, (option) => {
            return option.id === 'all';
        }));
    });

    $scope.$on(Events.filters.removeTag, function (event, filter) {
        if (filter === Events.filters.actionsSelect) {
            $scope.select(find($scope.options, (option) => {
                return option.id === 'all';
            }));
        }
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
