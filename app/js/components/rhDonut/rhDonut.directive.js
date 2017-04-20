/*global require*/
'use strict';

var componentsModule = require('../');
var c3 = require('c3');
var d3 = require('d3');
const capitalize = require('lodash/capitalize');

function generateChart(nameMapper) {
    return c3.generate({
        bindto: '.rha-telemetry-donut',
        size: {
            width: 320,
            height: 320
        },
        pie: {
            label: {
                threshold: 0.07
            }
        },
        data: {
            columns: [],
            colors: {
                Availability: '#1F77B4',
                Performance: '#2c96cb',
                Security: '#6d868d',
                Stability: '#46b631'
            },
            type: 'pie'
        },
        legend: {
            show: false
        },
        tooltip: {
            format: {
                name: nameMapper,
                value: function (value, ratio) {
                    if (ratio >= 0.07) {
                        return value;
                    }

                    let format = d3.format('0.3p');
                    return value + ' (' + format(ratio) + ')';
                }
            }
        }
    });
}

/**
 * @ngInject
 */
function rhaTelemetryDonut(
    $state,
    $timeout,
    RhaTelemetryActionsService,
    Stats,
    FilterService,
    Categories) {
    return {
        restrict: 'C',
        replace: true,
        link: function ($scope) {
            RhaTelemetryActionsService.setDonutChart(
                generateChart(RhaTelemetryActionsService.mapName));

            const cats = Categories.filter(cat => cat !== 'all');

            let refreshDonut = function (rules) {
                if (!rules) {
                    return;
                }

                const donutChart = RhaTelemetryActionsService.getDonutChart();

                function arcSelector(arcTitle) {
                    var classyTitle = arcTitle.replace(/[|._]/g, '-');
                    return '.c3-arc-' + classyTitle;
                }

                function loadData (cols, unload) {
                    donutChart.load({
                        columns: cols,
                        unload: unload,
                        done: function () {
                            angular.forEach(cols, function (col) {
                                const category = col[0];
                                const selector = arcSelector(category);
                                const elem = document.querySelector(selector);
                                angular.element(elem).on('touchend click', function () {
                                    $state.go('app.topic', {
                                        id: category.toLowerCase(),
                                        product: FilterService.getSelectedProduct()
                                    });
                                });
                            });
                        }
                    });
                }

                let cols = cats.map(cat => [capitalize(cat), rules[cat]])
                    .filter(cat => cat[1] > 0);
                loadData(cols, cats.map(capitalize));
            };

            $scope.$on('filterService:doFilter', refreshDonut);
            $scope.$watch('stats.rules', refreshDonut, true);
        }
    };
}

componentsModule.directive('rhaTelemetryDonut', rhaTelemetryDonut);
