'use strict';

const statesModule = require('../../');
const isEmpty = require('lodash/isEmpty');
const moment = require('moment-timezone');
const map = require('lodash/map');

/**
 * @ngInject
 */
function ViewErratumCtrl($filter,
                      $location,
                      $q,
                      $scope,
                      $state,
                      $stateParams,
                      gettextCatalog,
                      BreadcrumbsService,
                      InventoryService,
                      SystemModalTabs,
                      SystemsService,
                      Utils,
                      Vulnerability) {

    BreadcrumbsService.init($stateParams);

    $scope.rhsa_id = $stateParams.rhsa_id;
    $scope.pager = new Utils.Pager();
    $scope.loader = new Utils.Loader(false);
    $scope.systemLoader = new Utils.Loader(false);

    $scope.sorter = new Utils.Sorter({
        predicate: $location.search().sort_by || 'toString',
        reverse: $location.search().reverse || false
    }, order);

    function initPageHeader () {
        $scope.pageHeaderSubtitle = [
            gettextCatalog.getString('Release Date: {{date}}', {
                date: moment($scope.rhsa.issued).format('LL')
            }),
            gettextCatalog.getPlural(
                $scope.rhsa.packages.length, '1 Package', '{{$count}} Packages', {}),
            gettextCatalog.getPlural(
                $scope.rhsa.cves.length, '1 CVE', '{{$count}} CVEs', {})
        ];
    }

    $scope.showSystem = function (system_id) {
        InventoryService.showSystemModal(
            {system_id}, true, SystemModalTabs.vulnerabilities);
    };

    const getData = $scope.loader.bind(() => {
        return Vulnerability.getRHSA($scope.rhsa_id).then(res => {
            $scope.rhsa = res.data;
            BreadcrumbsService.add({
                label: $scope.rhsa.erratum_id,
                state: $state.current.name,
                param: {
                    rhsa_id: $scope.rhsa_id
                }
            });
            initPageHeader();
        })
        .then(() => $q.all($scope.rhsa.cves.map(Vulnerability.getCVE)))
        .then(results => $scope.cves = map(results, 'data'))
        .catch(res => {
            if (res.status === 404) {
                $state.go('app.vulnerabilities', {root_view: 'RHSAs'});
            }
        });
    });

    const systemParams = {
        page_size: $scope.pager.perPage
    };

    $scope.getSystems = $scope.systemLoader.bind((resetPager = true) => {
        if (resetPager) {
            $scope.pager.currentPage = 1;
        }

        $scope.pager.update();
        systemParams.page = $scope.pager.currentPage - 1;

        return Vulnerability.getRHSASystems($scope.rhsa_id, systemParams).then(res => {
            $scope.affectedSystems = res.data.resources;
            $scope.total = res.data.total;
        });
    });

    function order () {
        $location.search('sort_by', $scope.sorter.predicate);
        $location.search('reverse', $scope.sorter.reverse);
        systemParams.sort_by = $scope.sorter.predicate;
        systemParams.sort_dir = $scope.sorter.reverse ? 'DESC' : 'ASC';
        $scope.getSystems();
    }

    const machine_id = $location.search().machine;
    if (machine_id) {
        $scope.showSystem(machine_id);
    }

    $scope.search = function (model) {
        if (isEmpty(model)) {
            delete systemParams.search_term;
        } else {
            systemParams.search_term = model;
        }

        $scope.getSystems();
    };

    SystemsService.getSystemTypesAsync().then(() => {
        getData();
        $scope.getSystems();
    });

    $scope.$on('telemetry:esc', function ($event) {
        if ($event.defaultPrevented) {
            return;
        }

        if ($state.current.name === 'app.vulnerabilities-erratum') {
            $state.go('app.vulnerabilities', {root_view: 'Errata'});
        } else if ($state.current.name === 'app.vulnerabilities-package-erratum') {
            $state.go('app.vulnerabilities-package', {
                package_id: $stateParams.package_id
            });
        }
    });
}

statesModule.controller('ViewErratumCtrl', ViewErratumCtrl);
