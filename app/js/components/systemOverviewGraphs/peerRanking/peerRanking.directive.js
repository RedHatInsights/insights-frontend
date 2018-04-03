'use strict';

const componentsModule = require('../../');

function nth(n) {
    if (!Number.isInteger(n)) {
        return '';
    }

    let nStr = '' + n;
    switch (nStr[nStr.length - 1]) {
        case '1':
            return nStr + 'st';
        case '2':
            return nStr + 'nd';
        case '3':
            return nStr + 'rd';
        default:
            return nStr + 'th';
    }
}

/**
 * @ngInject
 */
function peerRankingCtrl($scope) {
    $scope.getCurrentAllSystemRank = (system) => {
        if (!system || !system.peer_rankings || !system.peer_rankings.all_systems ||
            !system.peer_rankings.all_systems.y) {
            return '';
        }

        let all_sys_rankings = system.peer_rankings.all_systems.y;
        return nth(all_sys_rankings[all_sys_rankings.length - 1]);
    };

    $scope.getCurrentIndustryRank = (system) => {
        if (!system || !system.peer_rankings || !system.peer_rankings.industry ||
            !system.peer_rankings.industry.y) {
            return '';
        }

        let all_sys_rankings = system.peer_rankings.industry.y;
        return nth(all_sys_rankings[all_sys_rankings.length - 1]);
    };
}

//TODO Use responsive card layout.

function peerRanking() {
    return {
        templateUrl:
            'js/components/systemOverviewGraphs/peerRanking/peerRanking.html',
        restrict: 'E',
        replace: true,
        controller: peerRankingCtrl,
        scope: {
            system: '='
        }
    };
}

componentsModule.directive('peerRanking', peerRanking);
