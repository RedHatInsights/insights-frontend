'use strict';

const componentsModule = require('../../');
const find = require('lodash/collection/find');

/**
 * @ngInject
 */
function checkInSelectCtrl($scope, gettextCatalog, FilterService) {
    $scope.options = [
        {
            id: 'all',
            label: gettextCatalog.getString('All'),
            online: true,
            offline: true
        }, {
            id: 'online',
            label: gettextCatalog.getString('Checking In'),
            online: true,
            offline: false
        }, {
            id: 'offline',
            label: gettextCatalog.getString('Stale'),
            online: false,
            offline: true
        }
    ];

    $scope.select = function (option) {
        $scope.selected = option;
        FilterService.setOnline(option.online);
        FilterService.setOffline(option.offline);
        FilterService.doFilter();
    };

    function read() {
        $scope.selected = find($scope.options, {
            online: FilterService.getOnline(),
            offline: FilterService.getOffline()
        });
        if (!$scope.selected) {
            throw new Error('Invalid online selector state: ' +
                FilterService.getOnline() + ':' + FilterService.getOffline());
        }
    }

    read();
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
