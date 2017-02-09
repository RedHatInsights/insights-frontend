'use strict';

var statesModule = require('../');
var c3 = require('c3');
/**
 * @ngInject
 */
function AnalyticsCtrl(Analytic) {
    var chart = c3.generate({
        data: {
            x: 'x',
            xFormat: '%Y-%m-%dT%H:%M:%S.%LZ',
            columns: []
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
    Analytic.reports().success(function (data) {
        var dates = data.map(function (d) {
            return d.date;
        });

        var totals = data.map(function (d) {
            return d.total;
        });

        totals.unshift('Totals');
        dates.unshift('x');
        console.log(data);
        chart.load({
            columns: [
                dates,
                totals
            ]
        });
    });
}

statesModule.controller('AnalyticsCtrl', AnalyticsCtrl);
