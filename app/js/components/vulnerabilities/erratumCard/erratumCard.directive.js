/*global require*/
'use strict';

const componentsModule = require('../../');

function erratumCardCtrl($q, $scope, $stateParams, DataUtils, Utils, Vulnerability) {
    $scope.defaultExpanded = $scope.erratum.erratum_id === $stateParams.rhsa_id;
    $scope.cveLoader = new Utils.Loader();

    const loadDetails = $scope.cveLoader.bind(() => {
        const results = $scope.erratum.cves.map(Vulnerability.getCVE);
        return $q.all(results)
        .then(results => results.map(res => res.data))
        .then(results => {
            results.forEach(DataUtils.cveImpactNum);
            $scope.cves = results;
        });
    });

    $scope.toggleContent = function (ctx) {
        if (ctx.collapsing || $scope.cves) {
            return;
        }

        loadDetails();
    };

    if ($scope.defaultExpanded) {
        loadDetails();
    }

    $scope.cveSorter = new Utils.Sorter({
        predicate: 'score',
        reverse: true
    });
    $scope.packageSorter = new Utils.Sorter({
        predicate: 'name',
        reverse: false
    });
}

/**
 * @ngInject
 */
function erratumCard() {
    return {
        templateUrl: 'js/components/vulnerabilities/erratumCard/erratumCard.html',
        restrict: 'E',
        replace: true,
        controller: erratumCardCtrl,
        scope: {
            erratum: '<'
        }
    };
}

componentsModule.directive('erratumCard', erratumCard);
