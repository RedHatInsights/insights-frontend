/*global require*/
'use strict';

const statesModule = require('../../');
const keyBy = require('lodash/keyBy');
const c3 = require('c3');
const d3 = require('d3');
const donutSize = 180;
const donutThickness = 13;

const donutVals     = {
    size: {
        width: donutSize,
        height: donutSize
    },
    donut: { width: donutThickness },
    data: { type: 'donut' },
    legend: { show: false }
};

function donutSettings(obj) {
    return Object.assign({}, donutVals, obj);
}

const charts = [
    {
        name: 'vulnerability',
        columns: [
            ['Secure systems', 982],
            ['Vulnerable systems', 218]
        ],
        title: '82%',
        color: {
            pattern: [
                '#0088CE',
                '#d1d1d1'
            ]
        }
    },

    {
        name: 'compliance',
        columns: [
            ['Compliant systems', 816],
            ['Noncompliant systems', 384]
        ],
        title: '68%',
        color: {
            pattern: [
                '#0088CE',
                '#d1d1d1'
            ]
        }
    },

    {
        name: 'advisor',
        columns: [
            ['Rules evaluated', 90],
            ['Rules passed', 65]
        ],
        title: '58%',
        color: {
            pattern: [
                '#0088CE',
                '#d1d1d1'
            ]
        }
    },

    {
        name: 'subscription',
        columns: [
            ['RHEL', 1050],
            ['Openshift', 100],
            ['Openstack', 50],
            ['Available', 25],
        ],
        title: '98%',
        color: {
            pattern: [
                '#cc0000',
                '#0088CE',
                '#2d7623',
                '#d1d1d1'
            ]
        }
    }
];

function generateCharts(chartData) {
    for (const data of chartData) {
        c3.generate(donutSettings({
            bindto: `.chart-${data.name}`,
            data: {
                columns: data.columns,
                type: 'donut',
                labels: false
            },
            donut: {
                title: data.title,
                width: donutThickness
            },
            color: data.color
        }));
    }
}

/**
 * @ngInject
 */
function DeploymentsCtrl($scope) {
    $scope.charts = keyBy(charts, 'name');
    generateCharts(charts);

    d3.select('.container')
        .insert('div', '.chart')
        .attr('class', 'legend')
        .selectAll('span')
        .data(['data1', 'data2', 'data3'])
        .enter().append('span')
        .attr('data-id', function (id) { return id; })
        .html(function (id) { return id; });

}

statesModule.controller('DeploymentsCtrl', DeploymentsCtrl);
