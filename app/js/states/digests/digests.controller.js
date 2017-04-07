/*global angular, require*/
'use strict';

const Plotly = require('plotly.js/lib/index-basic');
const statesModule = require('../');
const takeRight = require('lodash/array/takeRight');
const last = require('lodash/array/last');
const findIndex = require('lodash/array/findIndex');
const sortBy = require('lodash/collection/sortBy');
const html2canvas = require('html2canvas');
const Jspdf = require('jspdf');
const TIME_PERIOD = 30;

/**
 * @ngInject
 */
function DigestsCtrl($scope, DigestService, System, Rule, InventoryService, Severities) {
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

    function getHitsPerCat(label, lineBase, icon) {
        return {
            current: last(lineBase),
            direction: getDirection(
                takeRight(lineBase, 2)),
            icon: icon,
            label: label
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

    function ruleAppendixSorting(rules) {
        rules = sortBy(rules, function (r) {

            // this is gross but sortBy seems to sort the numbers
            //  alphabetically instead of numerically when dual-sorting,
            //  so pad with zeroes
            // of course, this breaks if a rule has 10 billion hits
            var paddedcount = '0000000000' + r.report_count;
            paddedcount = paddedcount.substr(('' + r.report_count).length);
            return [Severities.indexOf(r.severity), paddedcount];
        }).filter(function (r) {
            return r.report_count > 0;
        });

        rules.reverse();
        return rules;
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

    $scope.printPage = function () {
        var digestPromises = [];
        var graphsToCapture = [];

        digestPromises.push(html2canvas(
            document.querySelector('.gauge.gauge-circle.score.score_good')));
        digestPromises.push(html2canvas(document.querySelector('#categoryCounts')));

        graphsToCapture = [{
            key: 'metrics'
        },{
            key: 'registered',
            tabSelector: '[href=\'#systemsRegistered\']'
        },{
            key: 'score',
            tabSelector: '[href=\'#scoreHistory\']'
        },{
            graphId: '#allRuleHitsTable',
            tabSelector: '[href=\'#allRuleHits\']'
        }];

        // M A X I M U M   J A N K
        graphsToCapture.forEach(graph => {
            let selector;

            if (graph.hasOwnProperty('graphId')) {
                selector = graph.graphId;
            } else {
                selector = '[digest-key=' + graph.key + ']';
            }

            if (graphsToCapture.indexOf(graph) === 0) {
                digestPromises.push(html2canvas(document.querySelector(selector)));
            } else {
                if (graph.hasOwnProperty('key')) {
                    digestPromises.push(
                        new Promise((resolve) => {
                            document.querySelector(graph.tabSelector).click();
                            $scope.$on('plotly.resized.' + graph.key, () => {
                                setTimeout(() => {
                                    html2canvas(document.querySelector(selector))
                                    .then((canvas) => {
                                        resolve(canvas);
                                    });
                                }, 1000);
                            });
                        })
                    );
                } else {
                    digestPromises.push(
                        new Promise((resolve) => {
                            document.querySelector(graph.tabSelector).click();
                            setTimeout(() => {
                                html2canvas(document.querySelector(selector))
                                .then((canvas) => {
                                    resolve(canvas);
                                });
                            }, 1000);
                        })
                    );
                }
            }
        });

        Promise.all(digestPromises)
        .then(function (canvas) {
            var pdf = new Jspdf();

            var score = canvas[0];
            var catCounts = canvas[1];
            var metrics = canvas[2];
            var registered = canvas[3];
            var scorehistory = canvas[4];
            var allrulehits = canvas[5];

            var pageHeight = 295;
            var leftover = allrulehits.height / 5 + 20 - pageHeight;
            var y = 0;

            // reset view
            document.querySelector('[href=\'#metrics\']').click();

            pdf.text(10, 20, 'Overall Score');
            pdf.text(60, 20, 'Weekly Action Count by Category');
            pdf.addImage(
                score.toDataURL(), 'PNG', 10, 25,
                score.width / 5, score.height / 5);
            pdf.addImage(
                catCounts.toDataURL(), 'PNG', 60, 25,
                catCounts.width / 5, catCounts.height / 5);
            pdf.text(10, 55, 'Action Trends');
            pdf.addImage(
                metrics.toDataURL(), 'PNG', 10, 60,
                metrics.width / 5, metrics.height / 5);
            pdf.addImage(
                registered.toDataURL(), 'PNG', 10, 140,
                registered.width / 5, registered.height / 5);
            pdf.addImage(
                scorehistory.toDataURL(), 'PNG', 10, 220,
                scorehistory.width / 5, scorehistory.height / 5);
            pdf.addPage();

            pdf.addImage(
                allrulehits.toDataURL(), 'PNG', 10, 20,
                allrulehits.width / 5, allrulehits.height / 5);

            while (leftover >= 0) {
                y = leftover - allrulehits.height / 5;
                pdf.addPage();
                pdf.addImage(
                    allrulehits.toDataURL(), 'PNG', 10, y,
                    allrulehits.width / 5, allrulehits.height / 5);
                leftover -= pageHeight;
            }

            pdf.save('test.pdf');
        });
    };

    $scope.loading = true;

    $scope.showSystem = InventoryService.showSystemModal;

    Promise.all([digestPromise, systemPromise, rulePromise]).then(function (responses) {
        var res = responses[0];
        var sysres = responses[1];
        var ruleres = responses[2];
        var digestBase = res.data.resources[0].data;

        function getDigestMetricsLine(category, lineBase, color) {
            // warning this function needs to have access to digestBase.timeseries
            return {
                x: takeRight(digestBase.timeseries, TIME_PERIOD),
                y: takeRight(lineBase, TIME_PERIOD),
                type: 'scatter',
                name: category,
                marker: {
                    color: color
                }
            };
        }

        $scope.latest_score = takeRight(digestBase.scores, 1)[0];

        // current counts by category
        $scope.digest_hits_per_cat = [
            getHitsPerCat('Security', digestBase.security, 'fa-shield'),
            getHitsPerCat('Availability', digestBase.availability, 'fa-hand-paper-o'),
            getHitsPerCat('Stability', digestBase.stability, 'fa-cubes'),
            getHitsPerCat('Performance', digestBase.performance, 'fa-tachometer')
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
                    color: '#c7e7f6'
                }
            },
            getDigestMetricsLine('Security', digestBase.security, '#e77baf'),
            getDigestMetricsLine('Availability', digestBase.availability, '#f3923e'),
            getDigestMetricsLine('Stability', digestBase.stability, '#3badde'),
            getDigestMetricsLine('Performance', digestBase.performance, '#a5d786')
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
        $scope.allRuleHits = ruleAppendixSorting(ruleres.data.resources);
        $scope.loading = false;
    });
}

statesModule.controller('DigestsCtrl', DigestsCtrl);
