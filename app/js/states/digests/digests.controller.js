/*global angular, require*/
'use strict';

var Plotly = window.Plotly;
const statesModule = require('../');
const takeRight = require('lodash/array/takeRight');
const last = require('lodash/array/last');
const findIndex = require('lodash/array/findIndex');
const sortBy = require('lodash/collection/sortBy');
const TIME_PERIOD = 30;

/**
 * @ngInject
 */
function DigestsCtrl($scope, DigestService, System, Rule, InventoryService) {
    var digestPromise = DigestService.digestsByType('eval');
    var systemPromise = System.getSystems();
    var rulePromise = Rule.getRulesLatest();

    function getDirection(data) {
        const direction = data[1] - data[0];
        if (direction > 0) {
            return 1;
        }

        if (direction < 0) {
            return -1;
        }

        return 0;
    }

    function justLineGraph(digestBase, dataType, name, color) {
        return {
            data: [
                {
                    x: takeRight(digestBase.timeseries, TIME_PERIOD),
                    y: takeRight(digestBase[dataType], TIME_PERIOD),
                    mode: 'lines',
                    name: name,
                    line: {
                        width: 3,
                        color: color
                    }
                }
            ],
            layout: {
                margin: { t: 10, l: 40, r: 10, b: 40 },
                showlegend:true,
                legend: {orientation: 'h'}
            },
            options: {
                displayModeBar: false
            }
        };
    }

    function getTenWorst(items) {
        items = takeRight(sortBy(items,
            function (i) {
                return i.report_count;
            }
        ), 10);
        items.reverse();
        return items;
    }

    $scope.checkboxValues = {
        availability: true,
        security: true,
        stability: true,
        performance: true
    };

    $scope.toggleDataSources = function (e) {
        // TODO: move this shit along with the checkboxes into digestGraph
        //       for Plotly call abstraction
        var category = e.target.name;
        var catIdx;
        var metricsChart = document.querySelector('[digest-key=metrics]').children[0];

        // Note the differerence --
        // Remove traces based on index data attribute of digest_metrics
        // Add traces based on index in digest_metrics_data
        if ($scope.checkboxValues[category]) {
            catIdx = findIndex($scope.digest_metrics_data, function (d) {
                return d.name.toLowerCase() === category;
            });

            Plotly.addTraces(metricsChart, $scope.digest_metrics_data[catIdx]);
        } else {
            catIdx = findIndex($scope.digest_metrics.data, function (d) {
                return d.name.toLowerCase() === category;
            });

            Plotly.deleteTraces(metricsChart, catIdx);
        }
    };

    $scope.dateFormat = function (dateString) {
        var date = new Date(dateString);
        return date.getMonth() + '-' + date.getDay() + '-' + date.getFullYear();
    };

    $scope.loading = true;

    $scope.showSystem = InventoryService.showSystemModal;

    Promise.all([digestPromise, systemPromise, rulePromise]).then(function (responses) {
        var res = responses[0];
        var sysres = responses[1];
        var ruleres = responses[2];
        var digestBase = res.data.resources[0].data;

        $scope.latest_score = takeRight(digestBase.scores, 1)[0].toFixed(2);

        // current counts by category
        $scope.digest_hits_per_cat = [
            {
                current: last(digestBase.security),
                direction: getDirection(
                    takeRight(digestBase.security, 2)),
                icon: 'fa-shield',
                label: 'Security'
            },
            {
                current: last(digestBase.availability),
                direction: getDirection(
                    takeRight(digestBase.availability, 2)),
                icon: 'fa-hand-paper-o',
                label: 'Availability'
            },
            {
                current: last(digestBase.stability),
                direction: getDirection(
                    takeRight(digestBase.stability, 2)),
                icon: 'fa-cubes',
                label: 'Stability'
            },
            {
                current: last(digestBase.performance),
                direction: getDirection(
                    takeRight(digestBase.performance, 2)),
                icon: 'fa-tachometer',
                label: 'Performance'
            }
        ];

        // metrics
        //   big graphic
        //   systems not checking in
        //   total system actions
        $scope.digest_metrics_data = [
            {
                x: takeRight(digestBase.timeseries, TIME_PERIOD),
                y: takeRight(digestBase.distinct_rules, TIME_PERIOD),
                type: 'bar',
                name: 'Total Actions',
                marker: {
                    color: '#97cde6'
                }
            },
            {
                x: takeRight(digestBase.timeseries, TIME_PERIOD),
                y: takeRight(digestBase.security, TIME_PERIOD),
                type: 'scatter',
                name: 'Security',
                marker: {
                    color: '#e77baf'
                }
            },
            {
                x: takeRight(digestBase.timeseries, TIME_PERIOD),
                y: takeRight(digestBase.availability, TIME_PERIOD),
                type: 'scatter',
                name: 'Availability',
                marker: {
                    color: '#f3923e'
                }
            },
            {
                x: takeRight(digestBase.timeseries, TIME_PERIOD),
                y: takeRight(digestBase.availability, TIME_PERIOD),
                type: 'scatter',
                name: 'Stability',
                marker: {
                    color: '#3badde'
                }
            },
            {
                x: takeRight(digestBase.timeseries, TIME_PERIOD),
                y: takeRight(digestBase.performance, TIME_PERIOD),
                type: 'scatter',
                name: 'Performance',
                marker: {
                    color: '#a5d786'
                }
            }
        ];
        $scope.digest_metrics = {
            data: angular.copy($scope.digest_metrics_data),
            layout: {
                margin: { t: 10, l: 40, r: 10, b: 40 },
                showlegend:true,
                legend: {orientation: 'h'}
            },
            options: {
                displayModeBar: false
            }
        };

        $scope.digest_registered = justLineGraph(
            digestBase, 'checkins_per_day', 'Registered Systems', '#97cde6');
        $scope.digest_score = justLineGraph(
            digestBase, 'scores', 'Score', '#3083FB');

        $scope.topTenWorstSystems = getTenWorst(sysres.data.resources);
        $scope.topTenRules = getTenWorst(ruleres.data.resources);
        $scope.loading = false;
    });
}

statesModule.controller('DigestsCtrl', DigestsCtrl);
