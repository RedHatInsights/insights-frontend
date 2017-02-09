'use strict';

const componentsModule = require('../../');

/**
* @ngInject
*/
function systemSummary() {
    return {
        templateUrl: 'js/components/actions/systemSummary/systemSummary.html',
        restrict: 'E',
        scope: {
            stats: '='
        },
        link: function ($scope) {
            $scope.ratio = 0;

            $scope.$watch('stats.systems', function (value) {
                if (value && value.total) {
                    $scope.ratio = 100 * value.affected / value.total;
                }
            }, true);
        }
    };
}

componentsModule.directive('systemSummary', systemSummary);
