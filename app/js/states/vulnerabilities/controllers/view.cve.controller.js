'use strict';

const statesModule = require('../../');
const moment = require('moment-timezone');
const map = require('lodash/map');

/**
 * @ngInject
 */
function ViewCveCtrl($q,
                     $scope,
                     $state,
                     $stateParams,
                     gettextCatalog,
                     BreadcrumbsService,
                     Rule,
                     Utils,
                     Vulnerability) {

    $scope.cve_id = $stateParams.cve_id;
    $scope.selectedView = $stateParams.root_view;

    BreadcrumbsService.init($stateParams);
    $scope.loader = new Utils.Loader(false);
    $scope.ruleLoader = new Utils.Loader(false);

    function initPageHeader () {
        $scope.pageHeaderSubtitle = [
            gettextCatalog.getString('Public Date: {{date}}', {
                date: moment($scope.cve.public_date).format('LL')
            }),
            gettextCatalog.getString('Days Public: {{days_known}}', {
                days_known: Math.max(0, moment().diff($scope.cve.public_date, 'days'))
            })
        ];

        if ($scope.cve.iava) {
            $scope.pageHeaderSubtitle.push(`IAVA: ${$scope.cve.iava}`);
        }

        if ($scope.cve.cwe) {
            $scope.pageHeaderSubtitle.push(`CWE: ${$scope.cve.cwe}`);
        }
    }

    const getRules = $scope.ruleLoader.bind(cve => {
        return $q.all(cve.insights_rules.map(rule_id => Rule.byId(rule_id, true)))
        .then(res => $scope.rules = map(res, 'data'));
    });

    const getData = $scope.loader.bind(() => {
        return Vulnerability.getCVE($scope.cve_id).then(res => {
            $scope.cve = res.data;
            BreadcrumbsService.add({
                label: res.data.cve_id,
                state: $state.current.name,
                param: {
                    cve_id: $scope.cve_id
                }
            });

            initPageHeader();
            getRules(res.data);
        });
    });

    $scope.$on('telemetry:esc', function ($event) {
        if ($event.defaultPrevented) {
            return;
        }

        if ($state.current.name === 'app.vulnerabilities-cve') {
            $state.go('app.vulnerabilities', {root_view: 'CVEs'});
        }
    });

    getData();
}

statesModule.controller('ViewCveCtrl', ViewCveCtrl);
