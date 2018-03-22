'use strict';

const componentsModule = require('../../');

/**
 * @ngInject
 */
function peerRankingCtrl() {}

//TODO Use responsive card layout.

function peerRanking() {
    return {
        templateUrl:
            'js/components/systemOverviewGraphs/peerRanking/peerRanking.html',
        restrict: 'E',
        replace: false,
        controller: peerRankingCtrl,
        scope: {}
    };
}

componentsModule.directive('peerRanking', peerRanking);
