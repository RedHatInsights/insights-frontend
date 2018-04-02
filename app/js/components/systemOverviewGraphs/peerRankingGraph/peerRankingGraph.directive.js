'use strict';

const componentsModule = require('../../');
const Plotly = require('plotly.js/lib/index');
const d3 = Plotly.d3;

const layout = {
    autosize: true,
    font: {
        family: 'overpass, helvetica'
    },
    legend: {
        x: 0.65,
        y: 1
    },
    xaxis: {
        autorange: true,
        type: 'date',
        linecolor: 'rgba(238, 238, 238, 1)'
    },
    yaxis: {
        autorange: false,
        range: [40, 69],
        type: 'linear'
    },
    margin: {
        l: 30,
        r: 30,
        b: 50,
        t: 0
    }
};

function getData(system) {
    let allSystemsRankings = {
        name: 'System',
        type: 'scatter',
        mode: 'lines',
        x: system.peer_rankings.all_systems.x,
        y: system.peer_rankings.all_systems.y,
        marker: {
            color: 'rgba(39, 188, 255, 1)'
        }
    };

    let industryRankings = {
        name: 'Industry',
        type: 'scatter',
        mode: 'lines',
        x: system.peer_rankings.industry.x,
        y: system.peer_rankings.industry.y,
        marker: {
            color: 'rgba(128, 128, 128, 1)'
        }
    };

    return [allSystemsRankings, industryRankings];
}

/**
 * @ngInject
 */
function peerRankingGraphCtrl($scope, $element) {
    const node = d3.select($element[0])
        .append('div')
        .style({
            width: '100%',
            height: '200px'
        })
        .node();

    $scope.$watch('system', function (system) {
        Plotly.newPlot(node, getData(system), layout, {displayModeBar: false});
    });

    Plotly.newPlot(node, getData($scope.system), layout, {displayModeBar: false});

    window.addEventListener('resize', function () {
        let e = window.getComputedStyle(node).display;
        if (e && e !== 'none') {
            Plotly.Plots.resize(node);
        }
    });
}

function peerRankingGraph() {
    return {
        templateUrl:
            'js/components/systemOverviewGraphs/peerRankingGraph/peerRankingGraph.html',
        restrict: 'E',
        replace: true,
        controller: peerRankingGraphCtrl,
        scope: {
            system: '='
        }
    };
}

componentsModule.directive('peerRankingGraph',  ['$window', peerRankingGraph]);
