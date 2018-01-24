/*global require, window*/
'use strict';

var servicesModule = require('./');

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
    InsightsConfig,
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
    vars.data = {};
    vars.donutChart = null;
    vars.page = 0;
    vars.pageSize = 10;
    vars.ruleSystems = null;
    vars.rule = null;
    vars.ruleDetails = null;

    vars.systemNames = null;
    vars.totalRuleSystems = 0;

    // do this as soon as all the accessibles are defined (aka define vars, run dis)
    Utils.generateAccessors(pub, vars);

    pub.mapName = function (rule_id) {
        if (vars.data[rule_id] && vars.data[rule_id].name) {
            return vars.data[rule_id].name;
        }

        return rule_id;
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

        // TODO: this may be cached if we have all results fetched
        return pub.buildSystemsDeferred(paginate, pager)
        .then(priv.populateAffectedHosts);
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

    if (InsightsConfig.autoRefresh && !isNaN(InsightsConfig.autoRefresh)) {
        window.setInterval(pub.reload, parseInt(InsightsConfig.autoRefresh, 10));
    }

    return pub;
}

servicesModule.factory('RhaTelemetryActionsService', ActionsService);
