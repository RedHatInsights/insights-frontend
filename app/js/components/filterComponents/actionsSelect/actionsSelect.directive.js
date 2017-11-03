'use strict';

const componentsModule = require('../../');
const find = require('lodash/find');

/**
 * @ngInject
 */
function actionsSelectCtrl($rootScope,
                           $scope,
                           $location,
                           gettextCatalog,
                           Events,
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
        const urlParam = option.id !== 'all' ? option.id : null;

        $scope.selected = option;
        $location.search('systemHealth', urlParam);
        FilterService.doFilter();
        $rootScope.$broadcast(Events.filters.tag, getTag(), Events.filters.actionsSelect);
        $rootScope.$broadcast(Events.filters.actionsSelect, option);
    };

    function getTag () {
        return $scope.selected.tag;
    }

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

    function init() {
        const params = $location.search();

        if (params.systemHealth) {
            $scope.select(find($scope.options, (option) => {
                return option.id === params.systemHealth;
            }));
        } else {
            $scope.select(find($scope.options, (option) => {
                return option.id === 'all';
            }));
        }

        $rootScope.$broadcast(Events.filters.tag, getTag(), Events.filters.actionsSelect);
    }

    init();
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
