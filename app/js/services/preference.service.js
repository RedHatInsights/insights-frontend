'use strict';

var servicesModule = require('./');

/**
 * @ngInject
 */
function PreferenceService(UserSettings, $rootScope, Utils) {
    var prefs = {};

    return {
        //must explicitely say do not persist to backend,
        set: function (key, value, updateBackend) {
            prefs[key] = value;
            if (updateBackend || updateBackend === undefined) {
                UserSettings.update(prefs);
            }
        },

        get: function (key) {
            return prefs[key];
        },

        appendProductToUrl: function (url, type) {
            var prependChar = Utils.getNextQueryPrependChar(url);
            var product = this.get('dashboard_mode');
            var environments = null;
            var theType = type ? type : 'machine';
            if (product) {
                url += (prependChar +  'product=' + product);
                prependChar = Utils.getNextQueryPrependChar(url);
            }

            url += prependChar + 'type=' + theType;
            prependChar = Utils.getNextQueryPrependChar(url);
            if (product === 'osp') {
                environments = this.get('osp_deployment');
                if (environments) {
                    url += prependChar + 'environments=' + environments;
                }
            }

            return url;
        }
    };
}

servicesModule.service('PreferenceService', PreferenceService);
