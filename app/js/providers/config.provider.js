'use strict';

var providersModule = require('./');

/**
 * @ngInject
 */
function InsightsConfig() {
    var title = 'Red Hat Insights';
    var autoRefresh = 0;
    var authenticate = false;
    var allowExport = false;
    var doPaf = false;
    var getReportsErrorCallback = null;

    // function that is called when a system is clicked while
    // viewing actions
    var actionsShowSystem = null;

    // function that is called when a system is clicked while
    // viewing systems
    var systemShowSystem = null;
    var getSystemStatus = true;
    var fetchRelatedSolution = false;
    var gettingStartedLink = null;
    var apiPrefix = '/r/insights/';
    var apiVersion = 'v3';
    var apiRoot = concatRoot();
    var defaultApiPrefix = apiPrefix;
    var acctKey = 'telemetry:account_number';

    // Functions that will be called to determine if users
    // have access to certain functions. Functions will be passed
    // a callback that should be called with either true or false
    var canUnregisterSystems = null;
    var canIgnoreRules = null;
    var isPortal = false; // are we running inside customer portal or not?

    var systemAlerts = {
        'other_linux_system|OTHER_LINUX_SYSTEM': 1,
        'other_linux_system|OTHER_LINUX_SYSTEM_DETECTED': 1,
        'insights_heartbeat|INSIGHTS_HEARTBEAT': 1
    };

    var overviewKey = null;

    //
    //  Example configuration setting the property 'permission' to
    //  'admin' for the route app.actions
    //  {
    //    'app.actions': {
    //        customConfig: {
    //            permission: 'admin'
    //        }
    //    }
    //  };
    //
    var routeStateConfig = {};

    function concatRoot() {
        return apiPrefix + apiVersion + '/';
    }

    let isPlannerEnabled = true;

    return {
        setTitle: function (value) {
            title = value;
        },

        setAutoRefresh: function (value) {
            autoRefresh = value;
        },

        setAuthenticate: function (value) {
            authenticate = value;
        },

        setAllowExport: function (value) {
            allowExport = value;
        },

        setDoPaf: function (value) {
            doPaf = value;
        },

        setGetReportsErrorCallback: function (value) {
            getReportsErrorCallback = value;
        },

        setFetchRelatedSolution: function (value) {
            fetchRelatedSolution = value;
        },

        setActionsShowSystem: function (value) {
            actionsShowSystem = value;
        },

        setSystemShowSystem: function (value) {
            systemShowSystem = value;
        },

        setGetSystemStatus: function (value) {
            getSystemStatus = value;
        },

        setGettingStartedLink: function (value) {
            gettingStartedLink = value;
        },

        setApiPrefix: function (value) {
            apiPrefix = value;
            apiRoot = concatRoot();
        },

        setApiVersion: function (value) {
            apiVersion = value;
            apiRoot = concatRoot();
        },

        setCanUnregisterSystems: function (value) {
            canUnregisterSystems = value;
        },

        setCanIgnoreRules: function (value) {
            canIgnoreRules = value;
        },

        setPortal: function (value) {
            isPortal = value;
        },

        setRouteStateConfig: function (value) {
            routeStateConfig = value;
        },

        setOverviewKey: function (value) {
            overviewKey = value;
        },

        setPlannerEnabled (value) {
            isPlannerEnabled = value;
        },

        $get: function (Utils) {
            overviewKey = overviewKey ||
                (Utils.isBeta() ? 'overview-beta' : 'overview-stable');

            return {
                title: title,
                autoRefresh: autoRefresh,
                authenticate: authenticate,
                allowExport: allowExport,
                doPaf: doPaf,
                getReportsErrorCallback: getReportsErrorCallback,
                fetchRelatedSolution: fetchRelatedSolution,
                actionsShowSystem: actionsShowSystem,
                systemShowSystem: systemShowSystem,
                getSystemStatus: getSystemStatus,
                gettingStartedLink: gettingStartedLink,
                apiRoot: apiRoot,
                apiPrefix: apiPrefix,
                apiVersion: apiVersion,
                defaultApiPrefix: defaultApiPrefix,
                acctKey: acctKey,
                systemAlerts: systemAlerts,
                canUnregisterSystems: canUnregisterSystems,
                canIgnoreRules: canIgnoreRules,
                isPortal: isPortal,
                routeStateConfig: routeStateConfig,
                overviewKey: overviewKey,
                isPlannerEnabled
            };
        }
    };
}

providersModule.provider('InsightsConfig', InsightsConfig);
