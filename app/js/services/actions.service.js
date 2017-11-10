/*global require, angular, window*/
'use strict';

var servicesModule = require('./');
var reject = require('lodash/reject');
var filter = require('lodash/filter');
var map = require('lodash/map');
var reduce = require('lodash/reduce');
var indexOf = require('lodash/indexOf');
var groupBy = require('lodash/groupBy');
var indexBy = require('lodash/keyBy');

/**
 * @ngInject
 */
function ActionsService(
    $filter,
    $location,
    $q,
    $rootScope,
    $state,
    Report,
    Rule,
    System,
    Ack,
    InsightsConfig,
    Severities,
    ReloadService,
    FilterService,
    Utils) {

    var priv = {};
    var vars = {};
    var pub = {};

    pub.priv = priv; // just so we can unit test em
    pub.vars = vars; // just so we can unit test em
    // window.pub = pub; // just for debugging, commentme

    vars.allSystems = null;
    vars.category = null;
    vars.counts = {};
    vars.data = {};
    vars.dataLoaded = false;
    vars.donutChart = null;
    vars.initialSeverity = null;
    vars.loading = false;
    vars.oldCols = [];
    vars.page = 0;
    vars.pageSize = 10;
    vars.ruleSystems = null;
    vars.rules = [];
    vars.rule = null;
    vars.ruleDetails = null;

    vars.severities = {};
    vars.severityNames = Severities.map(function (severity) {return severity.value;});

    vars.systemNames = null;
    vars.total = 0;
    vars.totalRuleSystems = 0;

    // do this as soon as all the accessibles are defined (aka define vars, run dis)
    Utils.generateAccessors(pub, vars);

    angular.forEach(vars.severityNames, function (s) {
        vars.severities[s] = {
            selected: true,
            count: 0
        };
    });

    priv.severityFilter = function (report) {
        return vars.severities[report.severity].selected;
    };

    pub.isActions = function () {
        if (pub.getCategory()) {
            return false;
        }

        return true;
    };

    priv.ackFilter = function (report) {
        try {
            return Ack.ackMap[report.rule_id];
        } catch (ignore) {}
    };

    pub.mapName = function (rule_id) {
        if (vars.data[rule_id] && vars.data[rule_id].name) {
            return vars.data[rule_id].name;
        }

        return rule_id;
    };

    priv.processRules = function () {
        var filteredRules = reject(vars.rules, priv.ackFilter); //TODO: this won't wor;
        var tmpData = null;
        var total = 0;

        priv.updateCounts(filteredRules);
        priv.updateSeverityCounts(filteredRules);
        filteredRules = filter(filteredRules, priv.severityFilter);

        if (pub.isActions()) {
            tmpData = groupBy(filteredRules, function (r) {
                return r.category;
            });

            tmpData = map(tmpData, function (g, category) {
                var groupTotal = reduce(g, function (sum, n) {
                    return sum + n.report_count;
                }, 0);

                return {
                    id: category,
                    name: category,
                    value: groupTotal,
                    category: true
                };
            });

            tmpData = indexBy(tmpData, 'id');
        } else {
            tmpData = filter(filteredRules, function (r) {
                return (r.category.toLowerCase() === vars.category.toLowerCase());
            });

            tmpData = map(tmpData, function (r) {
                return {
                    id: r.rule_id,
                    name: r.description,
                    severityNum: indexOf(vars.severityNames, r.severity),
                    severity: r.severity,
                    category: r.category,
                    value: r.report_count,
                    color: ''
                };
            });

            tmpData = indexBy(tmpData, 'id');
        }

        total = reduce(tmpData, function (sum, n) {
            return sum + n.value;
        }, 0);

        pub.setData(tmpData);
        pub.setTotal(total);
        $rootScope.$broadcast('rha-telemetry-refreshdonut');
    };

    pub.populateData = function () {
        var rulesQuery;
        var rulesDeferred;
        var ackDeferred;
        var deferred;

        if (!vars.dataLoaded) {
            //pub.setLoading(true);

            rulesQuery = FilterService.buildRequestQueryParams([], ['role']);
            rulesQuery.report_count = 'gt0';

            rulesDeferred = Rule.getRulesLatest(rulesQuery);
            ackDeferred = Ack.reload();

            ackDeferred.then(rulesDeferred);

            rulesDeferred.success(function (response) {
                pub.setRules(response.resources);
                priv.processRules();
            });

            rulesDeferred.finally(function () {
                pub.setLoading(false);
                vars.dataLoaded = true;
            });

            return rulesDeferred;
        }

        //dataLoaded already
        deferred = $q(function (resolve) {
            resolve('norefresh');
        });

        deferred.then(function () {
            priv.processRules();
        });

        return deferred;
    };

    priv.updateCounts = function (rules) {
        var _count     = 0;
        var tempCounts = {
            security:    0,
            stability:   0,
            performance: 0
        };

        rules = groupBy(rules, function (r) {
            return r.category;
        });

        reduce(rules, function (result, n, key) {
            var k = key.toLowerCase();
            result[k] = reduce(n, function (sum, n) {
                return sum + n.report_count;
            }, 0);

            _count += result[k];
            return result;
        }, tempCounts);

        pub.setCounts(tempCounts);
    };

    priv.updateSeverityCounts = function (rules) {
        var rulesBySeverity;
        var total = 0;

        if (!pub.isActions()) {
            rules = filter(rules, function (r) {
                return (r.category.toLowerCase() === vars.category.toLowerCase());
            });
        }

        rulesBySeverity = groupBy(rules, 'severity');
        angular.forEach(vars.severityNames, function (s) {
            if (angular.isDefined(rulesBySeverity[s])) {
                vars.severities[s].count = reduce(rulesBySeverity[s], function (sum, n) {
                    return sum + n.report_count;
                }, 0);

                total += vars.severities[s].count;
            } else {
                vars.severities[s].count = 0;
            }
        });

        vars.severities.All.count = total;
    };

    pub.arcClick = function (arc) {
        if (arc.category === true) {
            return $state.go('app.actions', {
                category: arc.id.toLowerCase()
            });
        }

        $state.go('app.actions-rule', {
            category: arc.category.toLowerCase(),
            rule: arc.id
        });
    };

    pub.ackAction = function (rule) {
        Ack.createAck(rule).then(priv.processRules);
    };

    /**
     * Builds systemsQuery for retrieving the systems affected by the current action
     *
     * @param paginate if false retrieves all systems affected by the current action
     * @param pager contains the current page and page size values
     */
    priv.buildSystemsQuery = function (paginate, pager) {
        let systemsQuery = FilterService.buildRequestQueryParams(null, ['role']);

        systemsQuery.rule = encodeURIComponent(pub.getRule());

        if (paginate) {

            // UI paging starts at 1, programmatic page starts at 0
            systemsQuery.page = (pager.currentPage - 1);
            systemsQuery.page_size = pager.perPage;
        }

        // offline / systems not checking in
        if (FilterService.getOffline() !== FilterService.getOnline()) {
            systemsQuery.offline = FilterService.getOffline().toString();
        }

        systemsQuery.sort_by = $location.search().sort_field;
        systemsQuery.sort_dir = $location.search().sort_direction;

        return systemsQuery;
    };

    /**
     * Sets ruleSystems to the list of systems on the current page
     *
     * @param pager contains the current page and page size values
     * @param paginate if false sets allSystems to all of the systems affected by the
     *        current action
     * @param systems the systems returned by the query
     */
    priv.setRuleSystems = function (pager, paginate, systems) {
        const offset = (pager.currentPage - 1) * pager.perPage;

        if (!paginate) {
            vars.allSystems = systems.resources;
            vars.ruleSystems = vars.allSystems.slice(offset, priv.getPageEnd(
                                                                vars.allSystems,
                                                                pager.currentPage - 1,
                                                                pager.perPage));
        } else {
            vars.ruleSystems = systems.resources;
        }

        vars.totalRuleSystems = systems.total;
    };

    /**
     * Returns the index of the last item in the current page
     */
    priv.getPageEnd = function (source, page, pageSize) {
        if (source === null) {
            return 0;
        }

        let offset = page * pageSize;
        return (offset + pageSize) < source.length ?
                    (offset + pageSize) : source.length;
    };

    /**
     * Populates the affectedHosts so that the systemModal may pull this data
     */
    priv.populateAffectedHosts = function (results) {
        // Check the results for any possible affected_hosts in the report details
        let namePromises = [];
        let affectedHosts = false;

        if (results && results[0] && results[0].data && results[0].data.length > 0) {
            affectedHosts = [];
            for (let i in results[0].data) {
                affectedHosts.push(results[0].data[i].system_id);
            }
        }

        // If affected hosts were found, then retrieve their system names
        if (affectedHosts) {
            for (let j in affectedHosts) {
                namePromises.push(
                    System.getSingleSystem(affectedHosts[j])
                        .success(function (systemResult) {
                            return systemResult;
                        })
                );
            }

            return $q.all(namePromises).then(function (nameResults) {
                if (nameResults) {
                    vars.systemNames = {};
                    vars.systems = {};
                    for (let theSystemKey in nameResults) {
                        let theSystem = nameResults[theSystemKey].data;
                        let theSystemId = theSystem.system_id;
                        let theSystemName = theSystem.toString;
                        vars.systems[theSystemId] = theSystem;
                        vars.systemNames[theSystemId] = theSystemName;
                    }
                }
            });
        }
    };

    /**
     * Builds the query for getting the next page for actions page 3
     *
     * @param paginate if false pulls all systems affected by this action
     * @param pager contains the current page and page size of the page being pulled
     */
    pub.buildSystemsDeferred = function (paginate, pager) {
        let systemDeferred;
        let systemsQuery = priv.buildSystemsQuery(paginate, pager);

        if (FilterService.getParentNode()) {
            systemsQuery.includeSelf = true;
            systemDeferred =
                System.getSystemLinks(
                    FilterService.getParentNode(),
                    systemsQuery).success(function (systems) {
                        priv.setRuleSystems(pager, paginate, systems);
                    });
        } else {
            systemDeferred = System.getSystemsLatest(systemsQuery)
                .success(function (response) {
                    priv.setRuleSystems(pager, paginate, response);
                });
        }

        return systemDeferred;
    };

    /**
     * Populates the data needed for actions page 3
     *
     * Sets ruleSystems to the first page of systems
     *
     * @param paginate if false pulls all systems affected by this action
     * @param pager contains the current page and page size of the page being pulled
     */
    pub.initActionsRule = function (pager) {
        let systemDeferred = pub.buildSystemsDeferred(true, pager);

        let ruleDeferred = Rule.byId(pub.getRule()).success(function (rule) {
            vars.ruleDetails = rule;
        });

        return $q.all([systemDeferred, ruleDeferred]).then(function (results) {
            return priv.populateAffectedHosts(results);
        });
    };

    /**
     * Gets the current page for the actionsRule page (actions page 3)
     *
     * @param paginate if false pulls all systems affected by this action
     * @param pager contains the current page and page size of the page being pulled
     */
    pub.getActionsRulePage = function (paginate, pager) {
        let systemDeferred;

        // if we already have all of the systems affected use vars.allSystems
        systemDeferred = pub.buildSystemsDeferred(paginate, pager)
            .then(function (results) {
                return priv.populateAffectedHosts(results);
            });

        return systemDeferred;
    };

    /**
     * Sort actionsRule page (actions page 3)
     *
     * @param pager contains the page size of the page being pulled
     */
    pub.sortActionsRulePage = function (pager, predicate, reverse) {

        // if we already have all of the systems affected sort allSystems
        if (vars.allSystems !== null) {

            vars.allSystems = $filter('orderBy')(vars.allSystems,
                reverse ? '-' + predicate : predicate);
        }

        return pub.getActionsRulePage(true, pager);
    };

    pub.reload = function () {
        if (!vars.dataLoaded) {
            // we don't even have data yet - no need to reload
            return;
        }

        pub.setDataLoaded(false);

        pub.populateData().then(function () {
            pub.setLoading(false);
        });
    };

    pub.setInitialSeverity = function (sev) {
        if (sev) {
            angular.forEach(vars.severityNames, function (s) {
                if (sev === s || sev.toLowerCase() === 'all') {
                    vars.severities[s].selected = true;
                } else {
                    vars.severities[s].selected = false;
                }
            });
        }
    };

    if (InsightsConfig.autoRefresh && !isNaN(InsightsConfig.autoRefresh)) {
        window.setInterval(pub.reload, parseInt(InsightsConfig.autoRefresh, 10));
    }

    return pub;
}

servicesModule.factory('RhaTelemetryActionsService', ActionsService);
