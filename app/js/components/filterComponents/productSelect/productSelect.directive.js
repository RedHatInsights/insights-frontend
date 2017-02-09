'use strict';

var componentsModule = require('../../');

/**
 * @ngInject
 */
function productSelectCtrl(
    $scope,
    $rootScope,
    Account,
    Events,
    System,
    SystemsService,
    Products,
    FilterService) {

    $scope.products = [];

    $scope.getSelectedProduct = FilterService.getSelectedProduct;
    $scope.getRHELOnly = FilterService.getRHELOnly;
    $scope.getProductLabel = function (product) {
        if (product === 'all') {
            return 'All Platforms';
        } else if (product === Products.rhel.code) {
            return Products.rhel.fullName;
        } else if (product === Products.osp.code) {
            return Products.osp.fullName;
        } else if (product === Products.rhev.code) {
            return Products.rhev.fullName;
        } else if (product === Products.ocp.code) {
            return Products.ocp.fullName;
        } else if (product === Products.docker.code) {
            return Products.docker.fullName;
        }
    };

    function setDefaultRHEVRoles() {
        FilterService.setRolesQueryParam('manager', 'inventoryRHEVManagers');
        FilterService.setRolesQueryParam('hypervisor', 'inventoryRHEVHypervisors');
    }

    function setDefaultDockerRoles() {
        FilterService.setRolesQueryParam('host', 'inventoryDockerHosts');
        FilterService.setRolesQueryParam('container', 'inventoryDockerContainers');
        FilterService.setRolesQueryParam('image', 'inventoryDockerImages');
    }

    function setDefaultOSPRoles() {
        FilterService.setRolesQueryParam('director', 'inventoryOSPDirector');
        FilterService.setRolesQueryParam('cluster', 'inventoryOSPCluster');
        FilterService.setRolesQueryParam('compute', 'inventoryOSPCompute');
        FilterService.setRolesQueryParam('controller', 'inventoryOSPController');
    }

    function setDefaultOCPRoles() {
        FilterService.setRolesQueryParam('director', 'inventoryOCPDirector');
        FilterService.setRolesQueryParam('master', 'inventoryOCPMaster');
        FilterService.setRolesQueryParam('node', 'inventoryOCPNodes');
    }

    $scope.doSelectProduct = function (product) {
        FilterService.setSelectedProduct(product);
        $rootScope.$broadcast(Events.checkboxes.reset);

        if (product === Products.rhev.code) {
            FilterService.setParentNode(null);
            setDefaultRHEVRoles();
            FilterService.doFilter();
        } else if (product === Products.docker.code) {
            System.populateDockerHosts().then(function () {
                setDefaultDockerRoles();
                FilterService.doFilter();
            });
        } else if (product === Products.ocp.code) {
            System.populateOCPDeployments().then(function () {
                setDefaultOCPRoles();
                FilterService.doFilter();
            });
        } else if (product === Products.osp.code) {
            System.populateOSPDeployments().then(function () {
                setDefaultOSPRoles();
                FilterService.doFilter();
            });
        } else {
            FilterService.setParentNode(null);
            FilterService.doFilter();
        }
    };

    function init() {
        Account.getProducts().then(function (products) {
            $scope.products = products.data;
            if (products.data && products.data.length <= 1) {
                FilterService.setRHELOnly(true);
            } else {
                FilterService.setRHELOnly(false);
                $scope.products.splice(0, 0, 'all');
            }

            $rootScope.$broadcast(Events.filters.populatedProducts);
        });
    }

    $rootScope.$on('reload:data', init);
    init();
}

function productSelect() {
    return {
        templateUrl: 'js/components/filterComponents/productSelect/productSelect.html',
        restrict: 'E',
        controller: productSelectCtrl
    };
}

componentsModule.directive('productSelect', productSelect);
