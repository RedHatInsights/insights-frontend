'use strict';
var apiModule = require('./');

/**
 * @ngInject
 */
function Report(
    $http,
    $rootScope,
    $window,
    InsightsConfig,
    AccountService,
    Group,
    Utils,
    PreferenceService,
    DataUtils) {

    var root = InsightsConfig.apiRoot;

    var _countDfd;

    $rootScope.$on('reload:data', function () {
        _countDfd = null;
    });

    return {
        groupByHost: function () {
            return $http.get(root + 'reports?accept=host' + AccountService.current('&'));
        },

        exportReports: function (category) {
            // v1 is hardcoded here because v2 of the reports endpoint
            // does not support csv yet
            // TODO: csv support for v2
            var v1Root = InsightsConfig.apiPrefix + 'v1/';
            var url = v1Root + 'reports?accept=csv' + AccountService.current('&');
            if (category) {
                url += ('&category=' + category);
            }

            url = Group.appendCurrentGroup(url);
            $window.location.assign(url);
        },

        ruleReports: function (rule_id, attr) {
            rule_id = encodeURIComponent(rule_id);
            let ruleParam = (attr ? 'rule_id=' : 'rule=');
            let url =
                root +
                'reports?' +
                ruleParam +
                rule_id +
                AccountService.current('&');
            url = Group.appendCurrentGroup(url);
            if (attr) {
                url += ('&' + attr + '=true');
            }

            url = PreferenceService.appendProductToUrl(url, 'all');
            return $http.get(url);
        },

        headReports: function (query) {
            var url = root + 'reports';
            url += AccountService.current('?');
            url = Utils.addQueryToUrl(url, query);
            return $http.head(url);
        },

        /***************************************************************************
         * XXX
         * Be very careful when making calls to /reports. Whenever possible, load
         * only the specific data you need to draw the view. GETing /reports will
         * download hundreds of megabytes of data for large accounts.
         ***************************************************************************/
        getAllReports: function () {
            return $http.get(root + 'reports?type=all&expand=system,rule' +
                AccountService.current('&'))
                .then(function (res) {
                    res.data.resources.forEach(DataUtils.readReport);
                    return res.data.resources;
                });
        },

        getReportsLatest: function (query) {
            var url = root + 'reports';
            url += AccountService.current('?');
            url = Utils.addQueryToUrl(url, query);
            return $http.get(url);
        },

        getReports: function (product) {
            product = product || 'rhel';
            return $http.get(
                root +
                'reports?product=' +
                product +
                AccountService.current('&')).success(
                    DataUtils.readArray(DataUtils.readReport));
        }
    };
}

apiModule.factory('Report', Report);
