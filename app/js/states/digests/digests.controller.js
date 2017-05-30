/*global angular, require*/
'use strict';

const statesModule = require('../');
const takeRight = require('lodash/takeRight');
const last = require('lodash/last');
const sortBy = require('lodash/sortBy');
const filter = require('lodash/filter');
const sum = require('lodash/sum');
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

        // throw out 0 hit items
        items = filter(items, function (i) {
            return i.report_count > 0;
        });

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
            return [Severities.map(function (severity) {
                return severity.value;
            }).indexOf(r.severity), paddedcount];
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

    function calculateResolvedIssues (digest) {
        return sum(takeRight(digest.resolved, TIME_PERIOD));
    }

    $scope.timePeriod = function () {
        return TIME_PERIOD;
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

        // max score is 850, min is 250.  Levels calculated by
        //  separating the 600 range into 4 segments and dividing
        //  score by segment length (150)
        const level = Math.ceil(($scope.latest_score - 250) / 150) || 1;
        const scoreDiv = angular.element(
            document.querySelector('.gauge.gauge-circle.score'));
        scoreDiv.addClass('score_lvl' + level);

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
            digestBase, 'checkins_per_day', 'Active Systems', '#97cde6');
        $scope.digest_score = justLineGraph(
            digestBase, 'scores', 'Score', '#3083FB');

        $scope.systemsTilTen = 10 - sysres.data.resources.length;
        $scope.topTenWorstSystems = getTenWorst(sysres.data.resources);
        $scope.topTenRules = getTenWorst(ruleres.data.resources);
        $scope.allRuleHits = ruleAppendixSorting(ruleres.data.resources);
        $scope.resolvedIssues = calculateResolvedIssues(digestBase);
        $scope.loading = false;
    });
}

statesModule.controller('DigestsCtrl', DigestsCtrl);
