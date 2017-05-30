'use strict';

var servicesModule = require('./');

//service to store multi button directive states,
//this allows other directives to easily read button state
function MultiButton(Categories, Severities) {
    var multiButton = {};

    multiButton.RULE_ADMIN_CAT_FILTER_KEY = 'rule-admin-category';

    multiButton.inventoryWithActions = {
        state: true
    };
    multiButton.inventoryWithoutActions = {
        state: true
    };
    multiButton.inventoryInfo = {
        state: true
    };
    multiButton.inventoryWarn = {
        state: true
    };
    multiButton.inventoryError = {
        state: true
    };
    multiButton.inventoryAvailability = {
        state: true
    };
    multiButton.inventoryStability = {
        state: true
    };
    multiButton.inventoryPerformance = {
        state: true
    };
    multiButton.inventorySecurity = {
        state: true
    };
    multiButton.inventoryStandalone = {
        state: true
    };
    multiButton.inventoryRHEVClusters = {
        state: true
    };
    multiButton.inventoryRHEVManagers = {
        state: true
    };
    multiButton.inventoryRHEVHypervisors = {
        state: true
    };
    multiButton.inventoryDockerHosts = {
        state: true
    };
    multiButton.inventoryDockerContainers = {
        state: true
    };
    multiButton.inventoryDockerImages = {
        state: true
    };
    multiButton.inventoryOSPCluster = {
        state: true
    };
    multiButton.inventoryOSPDirector = {
        state: true
    };
    multiButton.inventoryOSPCompute = {
        state: true
    };
    multiButton.inventoryOSPController = {
        state: true
    };

    Severities.map(function (severity) {
        return severity.value;
    }).forEach(function (severity) {
        var key = 'severityFilters' + severity;
        var state = false;
        if (severity === 'all') {
            state = true;
        }

        multiButton[key] = {
            state: state
        };
    });

    Categories.forEach(function (category) {
        var key = 'categoryFilters' + category;
        var state = false;
        if (category === 'all') {
            state = true;
        }

        multiButton[key] = {
            state: state
        };
    });

    // init rule admin category filter
    // unlike other filters, this one is persisted using localStorage
    Categories.forEach(function (category) {
        multiButton[multiButton.RULE_ADMIN_CAT_FILTER_KEY + category] = {
            state: false
        };
    });

    const activeKey = window.localStorage.getItem(
        'insights:' + multiButton.RULE_ADMIN_CAT_FILTER_KEY) || 'all';
    multiButton[multiButton.RULE_ADMIN_CAT_FILTER_KEY + activeKey].state = true;

    multiButton.getState = function (key) {
        if (multiButton[key]) {
            return multiButton[key].state;
        } else {
            console.error(
                'MultiButtonService state "' +
                    key + '" not found. Available states: ' +
                    JSON.stringify(Object.keys(multiButton)));
            return false;
        }
    };

    multiButton.setState = function (key, state) {
        if (multiButton[key]) {
            multiButton[key].state = state;
        }
    };

    multiButton.initState = function (key) {
        multiButton[key] = {
            state: false
        };
    };

    return multiButton;
}

servicesModule.service('MultiButtonService', MultiButton);
