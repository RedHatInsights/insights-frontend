'use strict';

var componentsModule = require('../../');

/**
 * @ngInject
 */
function filterSummaryCtrl(
    $scope,
    MultiButtonService,
    FilterService,
    Group,
    Events,
    Severities,
    Products,
    Categories) {

    $scope.fields = [];

    function fieldIsValid(field) {
        return $scope.validFields.indexOf(field) !== -1;
    }

    function addSeparator(text) {
        if (text.length > 0) {
            text += ', ';
        }

        return text;
    }

    $scope.summaryLabels = {
        platform: 'Platform',
        host: 'Host',
        actions: 'Actions',
        group: 'Group',
        types: 'Types',
        cluster: 'Deployment',
        category: 'Category',
        severity: 'Severity',
        offline: 'Offline'
    };

    $scope.getSummaryText = function () {
        var text = '';
        var ospDeployment;
        var dockerHost;
        var hostValue = '';
        var ospValue = '';
        var groupName = Group.current().display_name;
        var product = FilterService.getSelectedProduct();
        var rolesString = '';

        $scope.fields = [];
        if (!$scope.validFields) {
            $scope.validFields = [];
        }

        if (fieldIsValid('product') && !FilterService.getRHELOnly()) {
            if (FilterService.getSelectedProduct() === Products.rhel.code) {
                $scope.fields.push({
                    name: $scope.summaryLabels.platform,
                    value: Products.rhel.shortName
                });
            } else if (FilterService.getSelectedProduct() === Products.osp.code) {
                $scope.fields.push({
                    name: $scope.summaryLabels.platform,
                    value: Products.osp.shortName
                });
                ospDeployment = FilterService.getSelectedOSPDeployment();
                if (ospDeployment && fieldIsValid('osp_deployment')) {
                    if (ospDeployment.system_id === 'all') {
                        ospValue = 'All Deployments';
                    } else if (ospDeployment.display_name) {
                        ospValue = ospDeployment.display_name;
                    } else if (ospDeployment.hostname) {
                        ospValue = ospDeployment.hostname;
                    } else {
                        ospValue = ospDeployment.system_id;
                    }

                    $scope.fields.push({
                        name: Products.osp.roles.cluster.shortName,
                        value: ospValue
                    });
                }
            } else if (FilterService.getSelectedProduct() === Products.ocp.code) {
                $scope.fields.push({
                    name: $scope.summaryLabels.platform,
                    value: Products.ocp.shortName
                });
            } else if (FilterService.getSelectedProduct() === Products.rhev.code) {
                $scope.fields.push({
                    name: $scope.summaryLabels.platform,
                    value: Products.rhev.shortName
                });
            } else if (FilterService.getSelectedProduct() === Products.docker.code) {
                $scope.fields.push({
                    name: $scope.summaryLabels.platform,
                    value: Products.docker.shortName
                });
                dockerHost = FilterService.getSelectedDockerHost();
                if (dockerHost && fieldIsValid('docker_host')) {
                    if (dockerHost.system_id === 'all') {
                        hostValue = 'All Hosts';
                    } else if (dockerHost.display_name) {
                        hostValue = dockerHost.display_name;
                    } else if (dockerHost.hostname) {
                        hostValue = dockerHost.hostname;
                    } else {
                        hostValue = dockerHost.system_id;
                    }

                    $scope.fields.push({
                        name: $scope.summaryLabels.host,
                        value: hostValue
                    });
                }
            } else if (FilterService.getSelectedProduct() === 'all') {
                $scope.fields.push({name: $scope.summaryLabels.platform, value: 'All'});
            }
        }

        if (fieldIsValid('actions')) {
            if (MultiButtonService.getState('inventoryWithActions') &&
                MultiButtonService.getState('inventoryWithoutActions')) {

                $scope.fields.push({
                    name: $scope.summaryLabels.actions,
                    value: 'With or Without'
                });
            } else if (MultiButtonService.getState('inventoryWithActions')) {
                $scope.fields.push({
                    name: $scope.summaryLabels.actions,
                    value: 'With'
                });
            } else if (MultiButtonService.getState('inventoryWithoutActions')) {
                $scope.fields.push({
                    name: $scope.summaryLabels.actions,
                    value: 'Without'
                });
            }
        }

        if (fieldIsValid('group')) {
            if (!groupName) {
                $scope.fields.push({
                    name: $scope.summaryLabels.group,
                    value: 'All'
                });
            } else {
                $scope.fields.push({
                    name: $scope.summaryLabels.group,
                    value: groupName
                });
            }
        }

        if (fieldIsValid('category')) {
            Categories.forEach(function (category) {
                if (MultiButtonService.getState('categoryFilters' + category)) {
                    $scope.fields.push({
                        name: $scope.summaryLabels.category,
                        value: category
                    });
                }
            });
        }

        if (fieldIsValid('severity')) {
            Severities.forEach(function (severity) {
                if (MultiButtonService.getState('severityFilters' + severity)) {
                    $scope.fields.push({
                        name: $scope.summaryLabels.severity,
                        value: severity
                    });
                }
            });
        }

        if (fieldIsValid('role') && product !== Products.rhel.code && product !== 'all') {
            if (product === Products.osp.code) {
                if (MultiButtonService.getState('inventoryOSPCluster')) {
                    rolesString = addSeparator(rolesString);
                    rolesString += Products.osp.roles.cluster.shortName;
                }

                if (MultiButtonService.getState('inventoryOSPDirector')) {
                    rolesString = addSeparator(rolesString);
                    rolesString += Products.osp.roles.director.shortName;
                }

                if (MultiButtonService.getState('inventoryOSPCompute')) {
                    rolesString = addSeparator(rolesString);
                    rolesString += Products.osp.roles.compute.shortName;
                }

                if (MultiButtonService.getState('inventoryOSPController')) {
                    rolesString = addSeparator(rolesString);
                    rolesString += Products.osp.roles.controller.shortName;
                }
            } else if (product === Products.ocp.code) {
                if (MultiButtonService.getState('inventoryOCPCluster')) {
                    rolesString = addSeparator(rolesString);
                    rolesString += Products.ocp.roles.cluster.shortName;
                }

                if (MultiButtonService.getState('inventoryOCPMasters')) {
                    rolesString = addSeparator(rolesString);
                    rolesString += Products.osp.roles.master.shortName;
                }

                if (MultiButtonService.getState('inventoryOCPNodes')) {
                    rolesString = addSeparator(rolesString);
                    rolesString += Products.ocp.roles.node.shortName;
                }
            } else if (product === Products.rhev.code) {
                if (MultiButtonService.getState('inventoryRHEVHypervisors')) {
                    rolesString = addSeparator(rolesString);
                    rolesString += Products.rhev.roles.hypervisor.shortName;
                }

                if (MultiButtonService.getState('inventoryRHEVManagers')) {
                    rolesString = addSeparator(rolesString);
                    rolesString += Products.rhev.roles.manager.shortName;
                }

                if (MultiButtonService.getState('inventoryRHEVDeployments')) {
                    rolesString = addSeparator(rolesString);
                    rolesString += Products.rhev.roles.cluster.shortName;
                }

            } else if (product === Products.docker.code) {
                if (MultiButtonService.getState('inventoryDockerHosts')) {
                    rolesString = addSeparator(rolesString);
                    rolesString += Products.docker.roles.host.shortName;
                }

                if (MultiButtonService.getState('inventoryDockerImages')) {
                    rolesString = addSeparator(rolesString);
                    rolesString += Products.docker.roles.image.shortName;
                }

                if (MultiButtonService.getState('inventoryDockerContainers')) {
                    rolesString = addSeparator(rolesString);
                    rolesString += Products.docker.roles.container.shortName;
                }
            }

            $scope.fields.push({name: $scope.summaryLabels.types, value: rolesString});
        }

        if (fieldIsValid('offline') && FilterService.getOffline()) {
            $scope.fields.push({name: $scope.summaryLabels.offline, value: 'Yes'});
        }

        return text;
    };

    $scope.$on('filterService:doFilter', $scope.getSummaryText);
    $scope.$on(Events.filters.populatedProducts, $scope.getSummaryText);
    $scope.getSummaryText();
}

function filterSummary() {
    return {
        templateUrl: 'js/components/filterComponents/filterSummary/filterSummary.html',
        restrict: 'E',
        controller: filterSummaryCtrl,
        scope: {
            validFields: '='
        }
    };
}

componentsModule.directive('filterSummary', filterSummary);
