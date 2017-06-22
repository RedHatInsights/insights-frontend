'use strict';

var componentsModule = require('../');

/**
 * @ngInject
 */
function platformFilterCtrl(
    $scope,
    FilterService,
    MultiButtonService,
    Products,
    Categories,
    Report,
    System,
    HttpHeaders,
    QuickFilters,
    $q,
    PlatformService) {

    $scope.summaryTypes = QuickFilters.summaryTypes;

    $scope.loadingSummary = true;
    $scope.summaryCounts = {};

    $scope.$on('group:change', reload);
    $scope.$on('account:change', reload);

    $scope.getSummaryItems = function (productCode) {
        const items = [];
        if ($scope.summaryType === QuickFilters.summaryTypes.systems) {
            for (let role in Products[productCode].roles) {
                let roleObj = Products[productCode].roles[role];
                items.push(
                    $scope.summaryCounts[productCode][roleObj.code] + ' ' +
                    roleObj.shortName + 's');
            }
        } else if ($scope.summaryType === QuickFilters.summaryTypes.categories) {
            items.push(
                $scope.summaryCounts[productCode].stability + ' Stability');
            items.push(
                $scope.summaryCounts[productCode].performance + ' Performance');
            items.push(
                $scope.summaryCounts[productCode].security + ' Security');
            items.push(
                $scope.summaryCounts[productCode].availability + ' Availability');
        }

        return items;
    };

    //TODO: refactor MultiButtonService and this to by DRY
    function inventoryPlatforms () {
        return [{
            product: Products.rhel, // link to the Product to get more info in the Views
            // should deprecate next line??
            displayName: Products.rhel.fullName,
            doFilter: function () {
                FilterService.setSelectedProduct(Products.rhel.code);
            }
        }, {
            product: Products.docker, // link to the Product to get more info in the Views
            //should deprecate next line??
            displayName: Products.docker.fullName,
            subFilters: [{
                displayName: Products.docker.roles.host.shortName,
                doFilter: function () {
                    FilterService.setSelectedProduct(Products.docker.code);
                    MultiButtonService.setState('inventoryDockerContainers', false);
                    MultiButtonService.setState('inventoryDockerImages', false);
                    MultiButtonService.setState('inventoryDockerHosts', true);
                }
            }, {
                displayName: Products.docker.roles.container.shortName,
                doFilter: function () {
                    FilterService.setSelectedProduct(Products.docker.code);
                    MultiButtonService.setState('inventoryDockerContainers', true);
                    MultiButtonService.setState('inventoryDockerImages', false);
                    MultiButtonService.setState('inventoryDockerHosts', false);
                }
            }, {
                displayName: Products.docker.roles.image.shortName,
                doFilter: function () {
                    FilterService.setSelectedProduct(Products.docker.code);
                    MultiButtonService.setState('inventoryDockerContainers', false);
                    MultiButtonService.setState('inventoryDockerImages', true);
                    MultiButtonService.setState('inventoryDockerHosts', false);
                }
            }],
            doFilter: function () {
                FilterService.setSelectedProduct(Products.docker.code);
                MultiButtonService.setState('inventoryDockerContainers', true);
                MultiButtonService.setState('inventoryDockerImages', true);
                MultiButtonService.setState('inventoryDockerHosts', true);
            }
        }, {
            product: Products.ocp,
            displayName: Products.ocp.fullName,
            subFilters: [{
                displayName: Products.ocp.roles.cluster.shortName,
                doFilter: function () {
                    FilterService.setSelectedProduct(Products.ocp.code);
                    MultiButtonService.setState('inventoryOCPMasters', false);
                    MultiButtonService.setState('inventoryOCPNodes', false);
                    MultiButtonService.setState('inventoryOCPClusters', true);
                }
            }, {
                displayName: Products.ocp.roles.master.shortName,
                doFilter: function () {
                    FilterService.setSelectedProduct(Products.ocp.code);
                    MultiButtonService.setState('inventoryOCPMasters', true);
                    MultiButtonService.setState('inventoryOCPNodes', false);
                    MultiButtonService.setState('inventoryOCPClusters', false);
                }
            }, {
                displayName: Products.ocp.roles.node.shortName,
                doFilter: function () {
                    FilterService.setSelectedProduct(Products.ocp.code);
                    MultiButtonService.setState('inventoryOCPMasters', false);
                    MultiButtonService.setState('inventoryOCPNodes', true);
                    MultiButtonService.setState('inventoryOCPClusters', false);
                }
            }],
            doFilter: function () {
                FilterService.setSelectedProduct(Products.ocp.code);
                MultiButtonService.setState('inventoryOCPMasters', true);
                MultiButtonService.setState('inventoryOCPNodes', true);
                MultiButtonService.setState('inventoryOCPClusters', true);
            }
        }, {
            product: Products.rhev, // link to the Product to get more info in the Views
            // should deprecate next line??
            displayName: Products.rhev.fullName,
            subFilters: [{
                displayName: Products.rhev.roles.cluster.shortName,
                doFilter: function () {
                    FilterService.setSelectedProduct(Products.rhev.code);
                    MultiButtonService.setState('inventoryRHEVManagers', false);
                    MultiButtonService.setState('inventoryRHEVHypervisors', false);
                    MultiButtonService.setState('inventoryRHEVClusters', true);
                }
            }, {
                displayName: Products.rhev.roles.manager.shortName,
                doFilter: function () {
                    FilterService.setSelectedProduct(Products.rhev.code);
                    MultiButtonService.setState('inventoryRHEVManagers', true);
                    MultiButtonService.setState('inventoryRHEVHypervisors', false);
                    MultiButtonService.setState('inventoryRHEVClusters', false);
                }
            }, {
                displayName: Products.rhev.roles.hypervisor.shortName,
                doFilter: function () {
                    FilterService.setSelectedProduct(Products.rhev.code);
                    MultiButtonService.setState('inventoryRHEVManagers', false);
                    MultiButtonService.setState('inventoryRHEVHypervisors', true);
                    MultiButtonService.setState('inventoryRHEVClusters', false);
                }
            }],
            doFilter: function () {
                FilterService.setSelectedProduct(Products.rhev.code);
                MultiButtonService.setState('inventoryRHEVManagers', true);
                MultiButtonService.setState('inventoryRHEVHypervisors', true);
                MultiButtonService.setState('inventoryRHEVClusters', true);
            }
        }, {
            product: Products.osp, // link to the Product to get more info in the Views
            //should deprecate next line??
            displayName: Products.osp.fullName,
            subFilters: [{
                displayName: Products.osp.roles.cluster.shortName,
                doFilter: function () {
                    FilterService.setSelectedProduct(Products.osp.code);
                    MultiButtonService.setState('inventoryOSPCluster', true);
                    MultiButtonService.setState('inventoryOSPDirector', false);
                    MultiButtonService.setState('inventoryOSPCompute', false);
                    MultiButtonService.setState('inventoryOSPController', false);
                }
            }, {
                displayName: Products.osp.roles.director.shortName,
                doFilter: function () {
                    FilterService.setSelectedProduct(Products.osp.code);
                    MultiButtonService.setState('inventoryOSPCluster', false);
                    MultiButtonService.setState('inventoryOSPDirector', true);
                    MultiButtonService.setState('inventoryOSPCompute', false);
                    MultiButtonService.setState('inventoryOSPController', false);
                }
            }, {
                displayName: Products.osp.roles.compute.shortName,
                doFilter: function () {
                    FilterService.setSelectedProduct(Products.osp.code);
                    MultiButtonService.setState('inventoryOSPCluster', false);
                    MultiButtonService.setState('inventoryOSPDirector', false);
                    MultiButtonService.setState('inventoryOSPCompute', true);
                    MultiButtonService.setState('inventoryOSPController', false);
                }
            }, {
                displayName: Products.osp.roles.controller.shortName,
                doFilter: function () {
                    FilterService.setSelectedProduct(Products.osp.code);
                    MultiButtonService.setState('inventoryOSPCluster', false);
                    MultiButtonService.setState('inventoryOSPDirector', false);
                    MultiButtonService.setState('inventoryOSPCompute', false);
                    MultiButtonService.setState('inventoryOSPController', true);
                }
            }],
            doFilter: function () {
                FilterService.setSelectedProduct(Products.osp.code);
                MultiButtonService.setState('inventoryOSPCluster', true);
                MultiButtonService.setState('inventoryOSPDirector', true);
                MultiButtonService.setState('inventoryOSPCompute', true);
                MultiButtonService.setState('inventoryOSPController', true);
            }
        }];
    }

    function getCategoriesSummary(platforms) {
        const promises = [];

        function responseHandler(product_code, category) {
            return function (response) {
                $scope.summaryCounts[product_code][category] =
                    response.headers(HttpHeaders.resourceCount);
            };
        }

        for (let prod in Products) {
            if (!platforms.includes(prod)) {
                continue;
            }

            for (let i = 0; i < Categories.length; i++) {
                let cat = Categories[i];
                if (cat !== 'all') {
                    let productCode = Products[prod].code;
                    $scope.summaryCounts[productCode] = {};
                    let promise = Report.headReports({
                        product_code: productCode,
                        category: cat
                    }).then(responseHandler(productCode, cat));
                    promises.push(promise);
                }
            }
        }

        return $q.all(promises).then(function () {
            $scope.loadingSummary = false;
        });
    }

    function getSystemsSummary(platforms) {
        function getRoleCount(productCode, roleCode) {
            return System.headSystemsLatest({
                product_code: productCode,
                role: roleCode
            }).then(function (response) {
                $scope.summaryCounts[productCode][roleCode] =
                    response.headers(HttpHeaders.resourceCount);
            });
        }

        const promises = [];
        for (let prod in Products) {
            if (!platforms.includes(prod)) {
                continue;
            }

            $scope.summaryCounts[prod] = {};
            let roles = Products[prod].roles;
            for (let role in roles) {
                promises.push(getRoleCount(prod, role));
            }
        }

        return $q.all(promises).then(function () {
            $scope.loadingSummary = false;
        });
    }

    function getPlatformCounts (platforms) {
        if ($scope.summaryType === QuickFilters.summaryTypes.systems) {
            getSystemsSummary(platforms);
        } else if ($scope.summaryType === QuickFilters.summaryTypes.categories) {
            getCategoriesSummary(platforms);
        }
    }

    $scope.getFilterIconClass = function (filter) {
        return filter.icon;
    };

    $scope.getPlatform = function (code) {
        return Products[code];
    };

    $scope.selectFilter = function (filter) {
        filter.active = true;
        filter.doFilter();
        FilterService.doFilter();
    };

    $scope.viewAll = function () {
        FilterService.setSelectedProduct('all');
        MultiButtonService.setState('inventoryRHEVManagers', true);
        MultiButtonService.setState('inventoryRHEVHypervisors', true);
        MultiButtonService.setState('inventoryRHEVClusters', true);
        MultiButtonService.setState('inventoryDockerContainers', true);
        MultiButtonService.setState('inventoryDockerImages', true);
        MultiButtonService.setState('inventoryDockerHosts', true);
        MultiButtonService.setState('inventoryOSPCluster', true);
        MultiButtonService.setState('inventoryOSPDirector', true);
        MultiButtonService.setState('inventoryOSPCompute', true);
        MultiButtonService.setState('inventoryOSPController', true);
        FilterService.doFilter();
    };

    $scope.selectSubFilter = function (filter) {
        $scope.selectFilter(filter);
    };

    $scope.getImage = function () {
        var product = $scope.getSelectedProduct();
        if (product && product !== 'all') {
            return 'static/images/l_' + product + '.svg';
        }

        return false;
    };

    function reload () {
        $scope.platforms = [];
        PlatformService.getPlatforms().then(function (platforms) {
            const available = inventoryPlatforms();
            $scope.platforms = available.filter(p => platforms.includes(p.product.code));
            getPlatformCounts(platforms);
        });

        $scope.getSelectedProduct = FilterService.getSelectedProduct;
    }

    reload();
}

function platformFilter() {
    return {
        templateUrl: 'js/components/platformFilter/platformFilter.html',
        restrict: 'E',
        replace: true,
        controller: platformFilterCtrl,
        scope: {
            summaryType: '='
        }
    };
}

componentsModule.directive('platformFilter', platformFilter);
