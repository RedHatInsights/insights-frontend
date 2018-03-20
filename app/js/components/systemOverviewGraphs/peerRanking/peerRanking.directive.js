'use strict';

const componentsModule = require('../../');

/**
 * @ngInject
 */
function peerRankingCtrl() {
}

function peerRanking() {
    return {
        templateUrl:
            'js/components/systemOverviewGraphs/peerRanking/peerRanking.html',
        restrict: 'E',
        replace: true,
        controller: peerRankingCtrl,
        scope: {}
    };
}

componentsModule.directive('peerRanking', peerRanking);
