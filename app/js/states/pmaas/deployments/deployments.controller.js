/*global require*/
'use strict';

const statesModule = require('../../');
const keyBy = require('lodash/keyBy');
const demoData = require('../../../demoData');
const c3 = require('c3');
const d3 = require('d3');
const donutSize = 180;
const donutThickness = 8;

const donutVals = {
    size: {
        width: donutSize,
        height: donutSize
    },
    donut: {width: donutThickness},
    data: {type: 'donut'},
    legend: {show: false}
};

function donutSettings(obj) {
    return Object.assign({}, donutVals, obj);
}

function stateToColor(state) {
    switch (state) {
        case 'critical':
            return '#cc0000';
        case 'moderate':
            return '#f0ab00';
        default:
            return '#0088ce';
    }
}

function generateChartData() {
    const ratings = demoData.getDemoDeployment().ratings;

    return [
        {
            name: 'vulnerability',
            columns: [
                ['Secure systems', ratings.vulnerability.secure],
                ['Vulnerable systems', ratings.vulnerability.vulnerable]
            ],
            state: ratings.vulnerability.state,
            title: ratings.vulnerability.score + '%',
            color: {
                pattern: [
                    stateToColor(ratings.vulnerability.state),
                    '#d1d1d1'
                ]
            }
        },

        {
            name: 'compliance',
            columns: [
                ['Compliant systems', ratings.compliance.compliant],
                ['Noncompliant systems', ratings.compliance.nonCompliant]
            ],
            state: ratings.compliance.state,
            title: ratings.compliance.score + '%',
            color: {
                pattern: [
                    stateToColor(ratings.compliance.state),
                    '#d1d1d1'
                ]
            }
        },

        {
            name: 'advisor',
            columns: [
                ['Rules passed', ratings.advisor.passed],
                ['Rules failed', ratings.advisor.failed]
            ],
            state: ratings.advisor.state,
            title: ratings.advisor.score + '%',
            color: {
                pattern: [
                    stateToColor(ratings.advisor.state),
                    '#d1d1d1'
                ]
            }
        },

        {
            name: 'subscription',
            columns: [
                ['RHEL', ratings.subscription.rhel],
                ['OpenShift', ratings.subscription.openshift],
                ['OpenStack', ratings.subscription.openstack],
                ['Available', ratings.subscription.available]
            ],
            title: ratings.subscription.score + '%',
            color: {
                pattern: [
                    '#004368',
                    '#0088ce',
                    '#7dc3e8',
                    '#d1d1d1'
                ]
            }
        }
    ];
}

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
    let chartData = generateChartData();
    $scope.charts = keyBy(chartData, 'name');
    generateCharts(chartData);

    d3.select('.chart-vulnerability').select('.c3-chart-arcs-title')
        .append('tspan')
        .attr('dy', 25)
        .attr('x', 0)
        .text('Secure');

    d3.select('.chart-compliance').select('.c3-chart-arcs-title')
        .append('tspan')
        .attr('dy', 25)
        .attr('x', 0)
        .text('Compliant');

    d3.select('.chart-advisor').select('.c3-chart-arcs-title')
        .append('tspan')
        .attr('dy', 25)
        .attr('x', 0)
        .text('Optimized');

    d3.select('.chart-subscription').select('.c3-chart-arcs-title')
        .append('tspan')
        .attr('dy', 25)
        .attr('x', 0)
        .text('Utilized');

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
