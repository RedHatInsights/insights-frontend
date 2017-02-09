'use strict';

var servicesModule = require('./');

/**
* @ngInject
*/
function RuleAdminService (Report) {

    const globalCache = {};

    globalCache.get = function (rule) {
        if (!globalCache.contains(rule)) {
            globalCache[rule] = Report.getReportsLatest({
                rule: rule,
                expand: 'system',
                account_number: '*'
            }).then(function (res) {
                return res.data.resources;
            }).catch (function () {
                delete globalCache[rule];
            });
        }

        return globalCache[rule];
    };

    globalCache.contains = function (rule) {
        return rule in globalCache;
    };

    return {
        globalCache: globalCache
    };
}

servicesModule.service('RuleAdminService', RuleAdminService);
