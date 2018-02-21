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
        filterService.setSearchTerm('');
        filterService.setOnline(true);
        filterService.setOffline(true);
        filterService.doFilter();
    };

    filterService.doFilter = function () {
        $rootScope.$broadcast('filterService:doFilter');
    };

    filterService.updateParams = function (url_params) {
        if (!url_params.search_term && filterService.getSearchTerm()) {
            url_params.search_term = filterService.getSearchTerm();
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
        var params = $location.search();
        if (params.search_term) {
            filterService.setSearchTerm(params.search_term);
        }

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
