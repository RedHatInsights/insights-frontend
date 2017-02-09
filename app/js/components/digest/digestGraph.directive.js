'use strict';

var componentsModule = require('../');
var c3 = require('c3');

/**
 * @ngInject
 */
function digestGraphController($scope) {
    // puke chart to page
    c3.generate({
        bindto: '[digest-key=' + $scope.digestKey + ']',
        size: {
            height: 400,
            width: 800
        },
        data: {
            x: 'timeseries',
            json: $scope.digest.data, // .data.data.data.data...
            zoom: {
                enabled: true
            },
            groups:$scope.digest.groups,
            types: $scope.digest.types
        },
        axis: {
            x: {
                type: 'timeseries',
                tick: {
                    format: '%Y-%m-%d'
                }
            }
        }
    });
}

function digestGraph() {
    return {
        templateUrl: 'js/components/digest/digestGraph.html',
        restrict: 'E',
        controller: digestGraphController,
        replace: true,
        scope: {
            digest: '=',
            digestKey: '@'
        }
    };
}

componentsModule.directive('digestGraph', digestGraph);
