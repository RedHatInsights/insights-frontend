'use strict';

const statesModule = require('../../');
const isEmpty = require('lodash/isEmpty');
const findIndex = require('lodash/findIndex');

/**
 * @ngInject
 */
function ViewPackageCtrl($q,
                         $scope,
                         $state,
                         $stateParams,
                         $location,
                         $timeout,
                         gettextCatalog,
                         SystemModalTabs,
                         Vulnerability,
                         Rule,
                         Events,
                         BreadcrumbsService,
                         Utils) {

    const package_id = $stateParams.package_id;
    const breadcrumbs = BreadcrumbsService;

    $scope.isEmpty = isEmpty;
    $scope.detailsLoader = new Utils.Loader(false);
    $scope.errataLoader = new Utils.Loader(false);

    $scope.showCVEs = false;
    $scope.selectedView = $stateParams.root_view;

    breadcrumbs.init($stateParams);

    $scope.pager = new Utils.Pager(12);

    const errataParams = $scope.errataParams = {
        page_size: $scope.pager.perPage,
        sort_by: 'severity',
        sort_dir: 'DESC'
    };

    function initPageHeader() {
        $scope.pageHeaderSubtitle = [
            gettextCatalog.getString('RHSA Count: {{count}}', {
                count: $scope.package.erratum_count
            })
        ];
    }

    function resetSelection () {
        $scope.selectedRHSA = false;
    }

    const getDetails = $scope.detailsLoader.bind(() => {
        return Vulnerability.getPackage(package_id).then(pkg => {
            $scope.package = pkg.data;

            breadcrumbs.setCrumb({
                label: $scope.package.name,
                state: $state.current.name,
                param: {
                    package_id: $scope.package.name
                }
            }, 1);

            initPageHeader();
        }).catch(res => {
            if (res.status === 404) {
                $state.go('app.vulnerabilities', {root_view: 'Packages'});
            }
        });
    });

    $scope.getErrata = $scope.errataLoader.bind((resetPager = true) => {
        if (resetPager) {
            $scope.pager.currentPage = 1;
        }

        resetSelection();
        errataParams.page = $scope.pager.currentPage - 1;
        return Vulnerability.getPackageErrata(package_id, errataParams).then(errata => {
            $scope.rhsas = errata.data.resources;
            $scope.total = errata.data.total;

            if ($scope.rhsas.length === 1) {
                $scope.indexMe(1);
                $scope.toggleShowCVEs($scope.rhsas[0]);
                return;
            }

            const selectedRHSA = $location.search().selected_rhsa;
            if (selectedRHSA) {
                const index = findIndex($scope.rhsas, {erratum_id: selectedRHSA});
                if (index > -1) {
                    $scope.indexMe(index + 1);
                    $scope.toggleShowCVEs($scope.rhsas[index]);
                }
            }
        });
    });

    getDetails();
    $scope.getErrata();

    function round (x, to) {
        return Math.ceil(x / to) * to;
    }

    $scope.indexMe = function (index) {
        var windowWidth = document.documentElement.clientWidth;
        var windowSm    = 768;
        var windowMd    = 992;

        if (windowWidth < windowSm) {
            $scope.cveOrder = index;
        } else if (windowWidth >= windowSm && windowWidth < windowMd) {
            $scope.cveOrder = round(index, 2);
        } else if (windowWidth >= windowMd) {
            $scope.cveOrder = round(index, 4);
        }
    };

    $scope.toggleShowCVEs = function (rhsa) {
        if ($scope.selectedRHSA === rhsa || !rhsa || !rhsa.cve_count) {
            delete $scope.selectedRHSA;
            $location.search('selected_rhsa', null);
            return;
        }

        function select () {
            $scope.selectedRHSA = rhsa;
        }

        if (rhsa.cves) {
            select();
            return;
        }

        Vulnerability.getRHSA(rhsa.erratum_id).then(res => {
            return $q.all(res.data.cves.map(Vulnerability.getCVE));
        })
        .then(cves => rhsa.cves = cves.map(res => res.data))
        .then(select);
    };

    $scope.isSelected = function (rhsa) {
        if (rhsa && $scope.selectedRHSA) {
            return rhsa.erratum_id === $scope.selectedRHSA.erratum_id;
        }

        return false;
    };

    $scope.$on(Events.filters.rhsaSeverity, function (event, filter) {
        filter = (isEmpty(filter)) ? undefined : filter.toLowerCase();

        if (filter === errataParams.severity) {
            return;
        }

        errataParams.severity = filter;
        $scope.getErrata();
    });

    $scope.search = function (model) {
        if (isEmpty(model)) {
            delete errataParams.search_term;
        } else {
            errataParams.search_term = model;
        }

        $scope.getErrata();
    };

    $scope.$on('telemetry:esc', function ($event) {
        if ($event.defaultPrevented) {
            return;
        }

        if ($state.current.name === 'app.vulnerabilities-package') {
            $state.go('app.vulnerabilities', {root_view: 'Packages'});
        }
    });
}

statesModule.controller('ViewPackageCtrl', ViewPackageCtrl);
