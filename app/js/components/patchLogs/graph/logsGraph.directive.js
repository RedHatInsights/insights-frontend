'use strict';

const moment = require('moment');
const componentsModule = require('../../');
const demoData = require('../../../demoData');
const Plotly = require('plotly.js/lib/index');
const d3 = Plotly.d3;

function generateData() {
    let timeArray = [];
    for (let i = -30; i < -3; i++) {
        let d = moment().add(i, 'd').format('YYYY-MM-DD');
        timeArray.push(d);
    }

    timeArray.push(moment().subtract(3, 'd').format('YYYY-MM-DD'));
    timeArray.push(moment().subtract(2, 'd').format('YYYY-MM-DD'));
    timeArray.push(moment().subtract(1, 'd').format('YYYY-MM-DD'));

    const vulnerability = {
        name: 'Vulnerability',
        type: 'scatter',
        mode: 'lines',
        x: demoData.getDemoDeployment().ratings_history.vulnerability.x,
        y: demoData.getDemoDeployment().ratings_history.vulnerability.y,
        line: {
            color: '#007a87'
        }
    };

    const compliance = {
        name: 'Compliance',
        type: 'scatter',
        mode: 'lines',
        x: demoData.getDemoDeployment().ratings_history.compliance.x,
        y: demoData.getDemoDeployment().ratings_history.compliance.y,
        line: {
            color: '#f0ab00'
        }
    };

    const advisor = {
        name: 'Advisor',
        type: 'scatter',
        mode: 'lines',
        x: demoData.getDemoDeployment().ratings_history.advisor.x,
        y: demoData.getDemoDeployment().ratings_history.advisor.y,
        line: {
            color: '#92d400'
        }
    };

    const subscription = {
        name: 'Subscription',
        type: 'scatter',
        mode: 'lines',
        x: demoData.getDemoDeployment().ratings_history.subscription.x,
        y: demoData.getDemoDeployment().ratings_history.subscription.y,
        line: {
            color: '#0088ce'
        }
    };

    return [vulnerability, compliance, advisor, subscription];
}

const layout = {
    autosize: true,
    showlegend: true,
    font: {
        family: 'overpass, helvetica'
    },
    xaxis: {
        autorange: true,
        type: 'date'
    },
    yaxis: {
        autorange: true
    },
    margin: {
        l: 30,
        r: 0,
        b: 20,
        t: 0,
        pad: 4
    }
};

/**
 * @ngInject
 */
function logsGraphCtrl($scope, $element) {
    const node = d3.select($element[0])
        .select('.logs-graph')
        .append('div')
        .style({
            width: '100%',
            height: '160px'
        })
        .node();

    Plotly.newPlot(node, generateData(), layout, {displayModeBar: false});

    // hack, - this graph isn't initializing to the right size.
    Plotly.Plots.resize(node);

    window.addEventListener('resize', function () {
        let e = window.getComputedStyle(node).display;
        if (e && e !== 'none') {
            Plotly.Plots.resize(node);
        }
    });
}

function logsGraph() {
    return {
        templateUrl:
            'js/components/patchLogs/graph/logsGraph.html',
        restrict: 'E',
        replace: true,
        controller: logsGraphCtrl,
        scope: {
            data: '='
        }
    };
}

componentsModule.directive('logsGraph', logsGraph);
