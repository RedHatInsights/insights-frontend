'use strict';

const statesModule = require('../');
const takeRight = require('lodash/array/takeRight');

/**
 * @ngInject
 */
function DigestsCtrl($scope, DigestService) {
    function constructDigest (keys, digest_base) {
        var new_digest = angular.copy(digest_base);
        new_digest.data = {
            timeseries: digest_base.data.timeseries
        };

        // types for graph appearance
        new_digest.types = {};
        keys.forEach(function (k) {
            new_digest.data[k] = takeRight(digest_base.data[k], 30);
            new_digest.types[k] = 'area';
        });

        // groups for graph appearance
        new_digest.groups = [keys];
        return new_digest;
    }

    $scope.loading = true;

    DigestService.digestsByType('eval').then(function (res) {
        var digest_base = res.data.resources[0];

        $scope.digest_score = constructDigest(
            ['score', 'total_registered', 'total_distinct_rules'], digest_base);
        $scope.digest_severity = constructDigest(
            ['sev_error', 'sev_warn', 'sev_info'], digest_base);
        $scope.digest_category = constructDigest(
            ['category_availability', 'category_performance',
             'category_security', 'category_stabilty'], digest_base);

        // category_stabilty misspelled in database data

        $scope.loading = false;
    });
}

statesModule.controller('DigestsCtrl', DigestsCtrl);

