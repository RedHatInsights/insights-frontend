'use strict';

var servicesModule = require('./');

function FilterService(
    MultiButtonService,
    Group,
    $location,
    $rootScope,
    Severities,
    Categories,
    Events) {

    const recSeveritiesMap = {
        1: 'INFO',
        2: 'WARN',
        3: 'ERROR',
        4: 'CRITICAL'
    };

    let filterService = {};
    let _age = $location.search().age || 0;
    let _category = $location.search().category || 'all';
    let _incidents = $location.search()[Events.filters.incident] || 'all';
    let _ansibleSupport = $location.search()[Events.filters.ansibleSupport] || 'all';
    let _ruleStatus = $location.search()[Events.filters.ruleStatus] || 'all';
    let _likelihood = $location.search()[Events.filters.likelihood] || 0;
    let _impact = $location.search()[Events.filters.impact] || 0;
    let _rhsaSeverity = $location.search()[Events.filters.rhsaSeverity] || 0;
    let _daysKnown = $location.search()[Events.filters.daysKnown] || 0;
    let _selectedProduct = 'all';
    let _parentNode = null;
    let _dockerHosts = [];
    let _ospDeployments = [];
    let _ocpDeployments = [];
    let _selectedDockerHost = {};
    let _selectedOSPDeployment = {};
    let _selectedOCPDeployment = {};
    let _searchTerm = $location.search().search_term || null;
    let _showFilters = false;
    let _rhelOnly = false;
    let _offline = true;
    let _online = true;
    let _machine = null;

    filterService.setMachine = function (machine) {
        _machine = machine;
        filterService.setQueryParam('machine', machine);
    };

    filterService.getMachine = function () {
        return _machine;
    };

    filterService.getAge = function () {
        return _age;
    };

    filterService.setAge = function (age) {
        _age = Number.parseInt(age);
        _age = (_age === 0) ? null : _age;
        filterService.setQueryParam('age', _age);
    };

    filterService.setRHELOnly = function (rhelOnly) {
        _rhelOnly = rhelOnly;
    };

    filterService.getRHELOnly = function () {
        return _rhelOnly;
    };

    filterService.toggleShowFilters = function () {
        _showFilters = !_showFilters;
    };

    filterService.getShowFilters = function () {
        return _showFilters;
    };

    filterService.setShowFilters = function (showFilters) {
        _showFilters = showFilters;
    };

    filterService.setRolesQueryParam = function (role, roleStateKey) {
        var index;
        var roles = $location.search().roles;
        if (!roles) {
            roles = [];
        } else {
            roles = roles.split(',');
        }

        if (MultiButtonService.getState(roleStateKey)) {
            roles.push(role);
        } else {
            index = roles.indexOf(role);
            roles.splice(index, 1);
        }

        filterService.setQueryParam('roles', roles.join(','));
    };

    filterService.setOffline = function (offline) {
        _offline = offline;

        let param = offline.toString() === 'all' ? null : offline.toString();
        filterService.setQueryParam('offline', param);
    };

    filterService.setOnline = function (online) {
        _online = online;
        filterService.setQueryParam('online', online.toString());
    };

    filterService.getOffline = function () {
        return _offline;
    };

    filterService.getOnline = function () {
        return _online;
    };

    filterService.getRhsaSeverity = function () {
        return _rhsaSeverity;
    };

    filterService.setRhsaSeverity = function (rhsaSeverity) {
        _rhsaSeverity = rhsaSeverity;
        filterService.setQueryParam(Events.filters.rhsaSeverity, rhsaSeverity);
    };

    filterService.getDaysKnown = function () {
        return _daysKnown;
    };

    filterService.setDaysKnown = function (daysKnown) {
        _daysKnown = daysKnown;
        filterService.setQueryParam(Events.filters.daysKnown, daysKnown);
    };

    filterService.deleteQueryParam = function (name) {
        var obj = $location.search();
        obj[name] = null;
        $location.search(obj);
    };

    filterService.setQueryParam = function (name, value) {
        var obj = $location.search();
        obj[name] = value;
        $location.search(obj);
    };

    filterService.getSearchTerm = function () {
        return _searchTerm;
    };

    filterService.setSearchTerm = function (searchTerm) {
        _searchTerm = searchTerm;
        filterService.setQueryParam('search_term', searchTerm);
    };

    filterService.setCategory = function (category) {
        _category = category;
        filterService.setQueryParam('category', category);
    };

    filterService.getCategory = function () {
        return _category;
    };

    filterService.setIncidents = function (incidents) {
        _incidents = incidents;
    };

    filterService.getIncidents = function () {
        return _incidents;
    };

    filterService.setAnsibleSupport = function (ansibleSupport) {
        _ansibleSupport = ansibleSupport;
    };

    filterService.getAnsibleSupport = function () {
        return _ansibleSupport;
    };

    filterService.setRuleStatus = function (ruleStatus) {
        _ruleStatus = ruleStatus;
    };

    filterService.getRuleStatus = function () {
        return _ruleStatus;
    };

    filterService.setLikelihood = function (likelihood) {
        _likelihood = likelihood;
    };

    filterService.getLikelihood = function () {
        return _likelihood;
    };

    filterService.setImpact = function (impact) {
        _impact = impact;
    };

    filterService.getImpact = function () {
        return _impact;
    };

    /**
     * resets all filters and broadcasts doFilter
     */
    filterService.clearAll = function () {
        const resetParent = {
            system_id: 'all'
        };

        filterService.setSearchTerm('');
        filterService.setSelectedDockerHost(resetParent);
        filterService.setSelectedOSPDeployment(resetParent);
        filterService.setSelectedProduct('all');
        filterService.setOnline(true);
        filterService.setOffline(true);
        filterService.doFilter();
    };

    filterService.doFilter = function () {
        $rootScope.$broadcast('filterService:doFilter');
    };

    filterService.getSelectedProduct = function () {
        return _selectedProduct;
    };

    filterService.setSelectedProduct = function (selectedProduct) {
        _selectedProduct = selectedProduct;
        filterService.setQueryParam('product', selectedProduct);
    };

    filterService.setParentNode = function (parentNode) {
        _parentNode = parentNode;
    };

    filterService.getParentNode = function () {
        return _parentNode;
    };

    filterService.setDockerHosts = function (dockerHosts) {
        _dockerHosts = dockerHosts;
    };

    filterService.getDockerHosts = function () {
        return _dockerHosts;
    };

    filterService.setSelectedDockerHost = function (selectedDockerHost) {
        _selectedDockerHost = selectedDockerHost;
        if (filterService.getSelectedDockerHost().system_id === 'all') {
            filterService.setParentNode(null);
        } else {
            filterService.setParentNode(selectedDockerHost.system_id);
        }

        filterService.setQueryParam('docker_host', selectedDockerHost.system_id);
    };

    filterService.getSelectedDockerHost = function () {
        return _selectedDockerHost;
    };

    //ocp
    filterService.setOCPDeployments = function (ocpDeployments) {
        _ocpDeployments = ocpDeployments;
    };

    filterService.getSelectedOCPDeployment = function () {
        return _selectedOCPDeployment;
    };

    filterService.setSelectedOCPDeployment = function (selectedOCPDeployment) {
        _selectedOCPDeployment = selectedOCPDeployment;
        if (filterService.getSelectedOCPDeployment().system_id === 'all') {
            filterService.setParentNode(null);
        } else {
            filterService.setParentNode(selectedOCPDeployment.system_id);
        }

        filterService.setQueryParam('ocp_deployment', selectedOCPDeployment.system_id);
    };

    //osp
    filterService.setOSPDeployments = function (ospDeployments) {
        _ospDeployments = ospDeployments;
    };

    filterService.getOSPDeployments = function () {
        return _ospDeployments;
    };

    filterService.setSelectedOSPDeployment = function (selectedOSPDeployment) {
        _selectedOSPDeployment = selectedOSPDeployment;
        if (filterService.getSelectedOSPDeployment().system_id === 'all') {
            filterService.setParentNode(null);
        } else {
            filterService.setParentNode(selectedOSPDeployment.system_id);
        }

        filterService.setQueryParam('osp_deployment', selectedOSPDeployment.system_id);
    };

    filterService.getSelectedOSPDeployment = function () {
        return _selectedOSPDeployment;
    };

    filterService.buildOSPRolesString = function () {
        var roles = [];
        if (MultiButtonService.getState('inventoryOSPCluster')) {
            roles.push('cluster');
        }

        if (MultiButtonService.getState('inventoryOSPDirector')) {
            roles.push('director');
        }

        if (MultiButtonService.getState('inventoryOSPCompute')) {
            roles.push('compute');
        }

        if (MultiButtonService.getState('inventoryOSPController')) {
            roles.push('controller');
        }

        return roles.toString();
    };

    filterService.buildDockerRolesString = function () {
        var roles = [];
        if (MultiButtonService.getState('inventoryDockerHosts')) {
            roles.push('host');
        }

        if (MultiButtonService.getState('inventoryDockerImages')) {
            roles.push('image');
        }

        if (MultiButtonService.getState('inventoryDockerContainers')) {
            roles.push('container');
        }

        return roles.toString();
    };

    filterService.updateParams = function (url_params) {
        if (!url_params.search_term && filterService.getSearchTerm()) {
            url_params.search_term = filterService.getSearchTerm();
        }

        if (!url_params.product && filterService.getSelectedProduct()) {
            url_params.product = filterService.getSelectedProduct();
        }

        if (!url_params.role &&
            filterService.getSelectedProduct()) {

            if (filterService.getSelectedProduct() === 'rhev') {
                url_params.role = filterService.buildRHEVRolesString();
            } else if (filterService.getSelectedProduct() === 'docker') {
                url_params.role = filterService.buildDockerRolesString();
            } else if (filterService.getSelectedProduct() === 'osp') {
                url_params.role = filterService.buildOSPRolesString();
            }
        }

        if (!url_params.osp_deployment &&
            filterService.getSelectedOSPDeployment()) {

            if (filterService.getSelectedOSPDeployment().system_id) {
                url_params.osp_deployment =
                    filterService.getSelectedOSPDeployment().system_id;
            }
        }

        if (!url_params.docker_host &&
            filterService.getSelectedDockerHost()) {

            if (filterService.getSelectedDockerHost().system_id) {
                url_params.docker_host =
                    filterService.getSelectedDockerHost().system_id;
            }
        }

        if (!url_params.offline) {
            url_params.offline = filterService.getOffline();
        }

        if (!url_params.online) {
            url_params.online = filterService.getOnline();
        }

        return url_params;
    };

    filterService.parseBrowserQueryParams = function () {
        var roles;
        var params = $location.search();
        if (params.product) {
            filterService.setSelectedProduct(params.product);
        }

        if (params.search_term) {
            filterService.setSearchTerm(params.search_term);
        }

        if (params.osp_deployment) {
            filterService.setSelectedOSPDeployment({system_id: params.osp_deployment});
        }

        if (params.docker_host) {
            filterService.setSelectedDockerHost({system_id: params.docker_host});
        }

        if (params.roles) {
            roles = params.roles.split(',');
            roles.forEach(function (role) {
                if (role === 'cluster') {
                    MultiButtonService.setState('inventoryOSPCluster', true);
                } else if (role === 'compute') {
                    MultiButtonService.setState('inventoryOSPCompute', true);
                } else if (role === 'director') {
                    MultiButtonService.setState('inventoryOSPDirector', true);
                } else if (role === 'controller') {
                    MultiButtonService.setState('inventoryOSPController', true);
                } else if (role === 'host') {
                    MultiButtonService.setState('inventoryDockerHosts', true);
                } else if (role === 'container') {
                    MultiButtonService.setState('inventoryDockerContainers', true);
                } else if (role === 'image') {
                    MultiButtonService.setState('inventoryDockerImages', true);
                } else if (role === 'hypervisor') {
                    MultiButtonService.setState('inventoryRHEVHypervisors', true);
                } else if (role === 'manager') {
                    MultiButtonService.setState('inventoryRHEVManagers', true);
                }
            });
        } else {
            //default to show all roles
            MultiButtonService.setState('inventoryOSPCluster', true);
            MultiButtonService.setState('inventoryOSPCompute', true);
            MultiButtonService.setState('inventoryOSPDirector', true);
            MultiButtonService.setState('inventoryOSPController', true);
            MultiButtonService.setState('inventoryDockerHosts', true);
            MultiButtonService.setState('inventoryDockerContainers', true);
            MultiButtonService.setState('inventoryDockerImages', true);
            MultiButtonService.setState('inventoryOCPCluster', true);
            MultiButtonService.setState('inventoryOCPMaster', true);
            MultiButtonService.setState('inventoryOCPNodes', true);
            MultiButtonService.setState('inventoryRHEVHypervisors', true);
            MultiButtonService.setState('inventoryRHEVManagers', true);
        }

        if (params.severity) {
            Severities.map(function (s) {
                return s.value;
            }).forEach(function (severity) {
                if (severity === params.severity) {
                    MultiButtonService.setState('severityFilters' + severity, true);
                } else {
                    MultiButtonService.setState('severityFilters' + severity, false);
                }
            });
        }

        if (params.category) {
            Categories.forEach(function (category) {
                if (category === params.category) {
                    MultiButtonService.setState('categoryFilters' + category, true);
                } else {
                    MultiButtonService.setState('categoryFilters' + category, false);
                }
            });
        }

        //this is invalid, revert both back to true
        if (params.offline === 'false' && params.online === 'false') {
            filterService.setOffline(true);
            filterService.setOnline(true);
        } else {
            if (params.offline) {
                const offline = (params.offline === 'true');
                filterService.setOffline(offline);
            }

            if (params.online) {
                const online = (params.online === 'true');
                filterService.setOnline(online);
            }
        }

        if (params.machine) {
            filterService.setMachine(params.machine);
        }
    };

    filterService.buildRHEVRolesString = function () {
        var roles = [];
        if (MultiButtonService.getState('inventoryRHEVManagers')) {
            roles.push('manager');
        }

        if (MultiButtonService.getState('inventoryRHEVHypervisors')) {
            roles.push('hypervisor');
        }

        if (MultiButtonService.getState('inventoryRHEVDeployments')) {
            roles.push('cluster');
        }

        return roles.toString();
    };

    /**
     * whitelist > blacklist
     *
     * Each is an array of query params. If a param is on the whitelist it will be
     * included, if it's on the blacklist it won't be included. Priority is given
     * to the whitelist. If a param is on neither list it will be included.
     */
    filterService.buildRequestQueryParams = function (whitelist, blacklist) {
        const urlParams = $location.search();
        var query = {};
        var osp_deployment = filterService.getSelectedOSPDeployment().system_id;
        var docker_host = filterService.getSelectedDockerHost().system_id;

        if (!whitelist) {
            whitelist = [];
        }

        if (!blacklist) {
            blacklist = [];
        }

        function isOnList(param, list) {
            var response = false;
            if (list.indexOf(param) !== -1) {
                response = true;
            }

            return response;
        }

        function includeParam(param) {
            var response = true;
            if (isOnList(param, blacklist) && !isOnList(param, whitelist)) {
                response = false;
            }

            return response;
        }

        //search term
        if (filterService.getSearchTerm() && includeParam('search_term')) {
            query.search_term = filterService.getSearchTerm();
        }

        //with or without actions
        if (includeParam('report_count')) {
            if (urlParams.systemHealth === 'affected') {
                query.report_count = 'gt0';
            } else if (urlParams.systemHealth === 'healthy') {
                query.report_count = 'lt1';
            }
        }

        //product
        if (filterService.getSelectedProduct() === 'rhel' &&
            includeParam('product_code')) {

            query.product_code = 'rhel';
        } else if (filterService.getSelectedProduct() === 'osp') {
            if (includeParam('product_code')) {
                query.product_code = 'osp';
            }

            if (includeParam('role')) {
                query.role = filterService.buildOSPRolesString();
            }
        } else if (filterService.getSelectedProduct() === 'rhev') {
            if (includeParam('product_code')) {
                query.product_code = 'rhev';
            }

            if (includeParam('role')) {
                query.role = filterService.buildRHEVRolesString();
            }
        } else if (filterService.getSelectedProduct() === 'docker') {
            if (includeParam('product_code')) {
                query.product_code = 'docker';
            }

            if (includeParam('role')) {
                query.role = filterService.buildDockerRolesString();
            }
        } else if (filterService.getSelectedProduct() === 'ocp') {
            if (includeParam('product_code')) {
                query.product_code = 'ocp';
            }
        }

        //root
        if (osp_deployment && osp_deployment !== 'all' && includeParam('root')) {
            query.root = osp_deployment;
        }

        if (docker_host && docker_host !== 'all' && includeParam('root')) {
            query.root = docker_host;
        }

        //group
        if (Group.current().id && includeParam('group')) {
            query.group = Group.current().id;
        }

        //severity
        if (includeParam('severity')) {
            Severities.map(function (s) {
                return s.value;
            }).forEach(function (severity) {
                if (MultiButtonService.getState('severityFilters' + severity) &&
                    severity !== 'All') {
                    query.severity = severity;
                }
            });
        }

        //age
        if (includeParam('age') && _age && (Number.parseInt(_age) !== 0)) {
            query.publish_date = `-${_age}days`;
        }

        //category
        if (includeParam('category') && _category !== 'all') {
            query.category = _category;
        }

        //impact
        if (includeParam('rec_impact') && recSeveritiesMap[_impact]) {
            query.rec_impact = recSeveritiesMap[_impact];
        }

        //likelihood
        if (includeParam('rec_likelihood') && recSeveritiesMap[_likelihood]) {
            query.rec_likelihood = recSeveritiesMap[_likelihood];
        }

        //ansible support
        if (includeParam('ansible') && _ansibleSupport !== 'all') {
            if (_ansibleSupport === 'supported') {
                query.ansible = true;
            } else if (_ansibleSupport === 'notSupported') {
                query.ansible = false;
            }
        }

        //ignored/active rule
        if (includeParam('ignoredRules') && _ruleStatus !== 'all') {
            query.ignoredRules = _ruleStatus;
        }

        //incidents
        if (includeParam('incidents') && _incidents !== 'all') {
            if (_incidents === 'incidents') {
                query.hasIncidents = true;
            } else if (_incidents === 'nonIncidents') {
                query.hasIncidents = false;
            }
        }

        return query;
    };

    return filterService;
}

servicesModule.factory('FilterService', FilterService);
