'use strict';

var apiModule = require('./');

/**
 * @ngInject
 */
function Cluster($http, $rootScope, InsightsConfig, AccountService) {
    var root = InsightsConfig.apiRoot;
    var _clusterDfd;
    var _clusters;

    $rootScope.$on('reload:data', function () {
        _clusterDfd = null;
    });

    return {
        clusters: _clusters,
        getClusters: function () {
            if (_clusterDfd) {
                return _clusterDfd;
            }

            let url =
                root + 'systems?type=cluster&product=osp' + AccountService.current('&');
            _clusterDfd = $http.get(url).then(function (response) {
                _clusters = response.data;
                $rootScope.$broadcast('clusters:loaded', _clusters);
                return response;
            });

            return _clusterDfd;
        },

        getClusterReports: function (clusterid) {
            return $http.get(
                root + 'reports?system_id=' + clusterid + '&type=all&product=osp');
        }
    };
}

apiModule.factory('Cluster', Cluster);
