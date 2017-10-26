'use strict';

const componentsModule = require('../../');
const find = require('lodash/find');

/**
 * @ngInject
 */
function checkInSelectCtrl($rootScope, $scope, gettextCatalog, Events, FilterService) {
    $scope.options = [
        {
            id: 'all',
            label: gettextCatalog.getString('System status'),
            online: true,
            offline: true,
            tag: null
        }, {
            id: 'online',
            label: gettextCatalog.getString('Checking In'),
            online: true,
            offline: false,
            tag: gettextCatalog.getString('Status: Checking In')
        }, {
            id: 'offline',
            label: gettextCatalog.getString('Stale'),
            online: false,
            offline: true,
            tag: gettextCatalog.getString('Status: Stale')
        }
    ];

    $scope.select = function (option) {
        $scope.selected = option;
        FilterService.setOnline(option.online);
        FilterService.setOffline(option.offline);
        FilterService.doFilter();
        $rootScope.$broadcast(Events.filters.tag, getTag(), Events.filters.checkInSelect);
    };

    function getTag () {
        return $scope.selected.tag;
    }

    function read() {
        $scope.selected = find($scope.options, {
            online: FilterService.getOnline(),
            offline: FilterService.getOffline()
        });
        if (!$scope.selected) {
            throw new Error('Invalid online selector state: ' +
                FilterService.getOnline() + ':' + FilterService.getOffline());
        }

        $rootScope.$broadcast(Events.filters.tag, getTag(), Events.filters.checkInSelect);
    }

    read();

    $scope.$on(Events.filters.reset, function () {
        $scope.select(find($scope.options, (option) => {
            return option.id === 'all';
        }));
    });

    $scope.$on(Events.filters.removeTag, function (event, filter) {
        if (filter === Events.filters.checkInSelect) {
            $scope.select(find($scope.options, (option) => {
                return option.id === 'all';
            }));
        }
    });
}

function checkInSelect() {
    return {
        templateUrl: 'js/components/filterComponents/checkInSelect/checkInSelect.html',
        restrict: 'E',
        controller: checkInSelectCtrl,
        scope: {}
    };
}

componentsModule.directive('checkInSelect', checkInSelect);
