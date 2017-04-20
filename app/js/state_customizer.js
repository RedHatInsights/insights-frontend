'use strict';
const assign = require('lodash/assign');
const isArray = require('lodash/isArray');

/**
 * Adds arbitrary properties to ui-state objects. This allows Enterprise integration users
 * of the library to set attributes/functions on the state objects that can be checked/run
 * during state transitions. For example, a permission property could be set on the state
 * which can be checked before the allowing the page to shown.
 *
 * @param states a list of routes, as returned by ui-routers $state.get()
 * @param config a configuration object as defined by the InsightConfig.routeStateConfig
 * @see InsightsConfigProvider
 * Example configuration setting the property 'permission' to
 *    'admin' for the route state  'app.actions'
 *     {
 *       'app.actions': {
 *           customConfig: {
 *               permission: 'admin'
 *           }
 *       }
 *     };
 * NOTE - this function will overwrite any properties on the state that match the custom
 * configuration, so use with care!
 */
exports.process = function process(states, InsightsConfig) {
    if (!states || !isArray(states) || !InsightsConfig ||
        !InsightsConfig.routeStateConfig) {
        return;
    }

    states.forEach(function (state) {
        let stateConfig = InsightsConfig.routeStateConfig[state.name];
        if (stateConfig) {
            assign(state, stateConfig.customConfig);
        }
    });

};
