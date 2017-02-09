'use strict';

var componentsModule = require('../../../../');
var c3 = require('c3');

/**
 * @ngInject
 */
function generateBarCtrl($scope, $element) {

    $scope.buildBar = function (options) {
        $scope.chartMax = options.chartMax;
        $scope.goalsBar = c3.generate({
            bindto: $element[0].getElementsByClassName('bar-chart-wrapper')[0],
            size: {
                height: 200,
                width: 100
            },
            bar: {
                width: {
                    ratio: 0.5
                },
                expand: true
            },
            data: {
                columns: [
                    ['maxSystems', options.chartMax],
                    ['systemsRegistered',
                        options.systemCount <= options.chartMax ?
                        options.systemCount :
                        options.chartMax]
                ],
                type: 'bar'
            },
            axis: {
                x: {
                    show: false
                },
                y: {
                    show: false
                }
            },
            legend: {
                show: false
            },
            grid: {
                x: {
                    show: true
                },
                y: {
                    show: true
                }
            },
            tooltip: {
                format: {
                    /*...*/
                },
                contents: function (d) {
                    var text;
                    text =
                        '<div class="' + this.CLASS.tooltip + '">' +
                            '<text class="goal-bar-tooltip">' +
                                'Register more systems to complete the goal' +
                            '</text>' +
                        '</div>';
                    return (d[1].value != d[0].value) ? text : ''; //jshint ignore:line
                }
            }
        });

        $scope.$watch('systemCount', function (newValue) {
            if (newValue !== undefined) {
                $scope.goalsBar.load({
                    columns: [
                        ['maxSystems', $scope.chartMax],
                        ['systemsRegistered',
                            newValue <= $scope.chartMax ? newValue : $scope.chartMax]]
                });
            }
        });
    };
}

/**
 * @ngInject
 */
function goalsBar() {
    return {
        templateUrl: 'js/components/goals/goalsBar/goalsBar.html',
        restrict: 'E',
        replace: true,
        controller: generateBarCtrl
    };
}

componentsModule.directive('goalsBar', goalsBar);
