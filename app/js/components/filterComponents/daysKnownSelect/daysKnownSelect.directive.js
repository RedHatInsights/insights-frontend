'use strict';

const componentsModule = require('../../');

/**
 * @ngInject
 */
function daysKnownSelectCtrl($scope, gettextCatalog) {
    $scope.options = [
        {
            id: '0',
            label: gettextCatalog.getString('0')
        }, {
            id: '45',
            label: gettextCatalog.getString('45')
        }, {
            id: '90',
            label: gettextCatalog.getString('90')
        }
    ];
}

function daysKnownSelect() {
    return {
        templateUrl:
          'js/components/filterComponents/daysKnownSelect/daysKnownSelect.html',
        restrict: 'E',
        controller: daysKnownSelectCtrl,
        scope: {}
    };
}

componentsModule.directive('daysKnownSelect', daysKnownSelect);
