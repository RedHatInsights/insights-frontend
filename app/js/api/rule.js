'use strict';
var apiModule = require('./');
const URI = require('urijs');

/**
 * @ngInject
 */
function Rule(
    $http,
    $window,
    AccountService,
    DataUtils,
    InsightsConfig,
    PreferenceService,
    Utils) {

    var root = InsightsConfig.apiRoot;
    return {
        getRulesLatest: function (query) {
            var url = root + 'rules';
            url += AccountService.current('?');
            url = Utils.addQueryToUrl(url, query);
            return $http.get(url);
        },

        plugins: function () {
            return $http.get(root + 'rules?plugins=true');
        },

        summary: function () {
            var url = root + 'rules?summary=true' + AccountService.current('&');
            url = PreferenceService.appendProductToUrl(url, 'all');
            return $http.get(url);
        },

        admin: function () {
            return $http.get(root + 'rules/admin?internal=true');
        },

        create: function (rule) {
            return $http.post(root + 'rules?internal=true', rule);
        },

        /*jshint unused:false*/
        update: function (rule) {
            throw new Error('updates not supported');
            /*
            var rule_id = encodeURIComponent(rule._rule_id || rule.rule_id);
            return $http.put(root + 'rules/' + rule_id + '?internal=true', rule);
            */
        },

        delete: function (rule) {
            var rule_id = encodeURIComponent(rule.rule_id);
            return $http.delete(root + 'rules/' + rule_id + '?internal=true');
        },

        preview: function (rule, debug) {
            return $http.post(root + 'rules/preview?internal=true', {
                rule: rule,
                debug: debug
            });
        },

        byId: function (rule_id, skipCache) {
            rule_id = encodeURIComponent(rule_id);
            return $http.get(root + 'rules/' + rule_id, {
                cache: (skipCache !== true)
            });
        },

        getAvailableTags: function () {
            return $http.get(root + 'rules/tags');
        },

        deleteTag: function (tagName) {
            return $http.delete(root + 'rules/tags/' + encodeURIComponent(tagName));
        },

        /*jshint unused:false*/
        updateTag: function (tag) {
            throw new Error('updates not supported');
            /*
            return $http.put(
                root +
                'rules/tags/' +
                encodeURIComponent(tag.name), {description: tag.description});
            */
        },

        exportRules: function () {
            $window.location.assign(root + 'rules/admin?internal=true&accept=csv');
        },

        listAnsibleResolutions: function (ruleId, systemTypeId) {
            const url = URI(root);
            url.segment('rules');
            url.segment(ruleId);
            url.segment('ansible-resolutions');
            url.segment(String(systemTypeId));
            return $http.get(url.toString());
        },

        getRulesWithHits: function (group) {
            const uri = URI(root);
            uri.segment('rules');
            uri.addSearch('report_count', 'gt0');
            uri.addSearch(AccountService.queryParam());

            if (group !== undefined) {
                uri.addSearch({group});
            }

            return $http.get(uri.toString()).success(function (result) {
                result.resources.forEach(DataUtils.readRule);
            });
        },

        silenceSystems (rule_id, systems) {
            let uri = URI(root);
            let body = {
                system_acks: systems
            };

            uri.segment('rules');
            uri.segment(rule_id);
            uri.addSearch(AccountService.queryParam());
            return $http.put(uri.toString(), body);
        },

        silenceGroups (rule_id, groups) {
            let uri = URI(root);
            let body = {
                group_acks: groups
            };

            uri.segment('rules');
            uri.segment(rule_id);
            uri.addSearch(AccountService.queryParam());
            return $http.put(uri.toString(), body);
        }
    };
}

apiModule.factory('Rule', Rule);
