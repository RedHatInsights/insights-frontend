'use strict';

const componentsModule = require('../../');

/**
 * @ngInject
 */
function rhsaSeveritySelectCtrl($scope, gettextCatalog) {
    $scope.options = [
        {
            id: 'Critical',
            label: gettextCatalog.getString('Critical')
        }, {
            id: 'Important',
            label: gettextCatalog.getString('Important')
        }, {
            id: 'Moderate',
            label: gettextCatalog.getString('Moderate')
        }, {
            id: 'Low',
            label: gettextCatalog.getString('Low')
        }
    ];
}

function rhsaSeveritySelect() {
    return {
        templateUrl:
          'js/components/filterComponents/rhsaSeveritySelect/rhsaSeveritySelect.html',
        restrict: 'E',
        controller: rhsaSeveritySelectCtrl,
        scope: {}
    };
}

componentsModule.directive('rhsaSeveritySelect', rhsaSeveritySelect);
