'use strict';
/*global confirm*/

var statesModule = require('../../');
var find = require('lodash/find');
var map = require('lodash/map');
var pick = require('lodash/pick');
var remove = require('lodash/array/remove');
var reject = require('lodash/reject');
var sortBy = require('lodash/collection/sortBy');
const capitalize = require('lodash/capitalize');

/**
 * @ngInject
 */
function EditTopicCtrl(
    $scope,
    Topic,
    Rule,
    $state,
    $stateParams,
    DataUtils,
    Categories,
    $window,
    $rootScope,
    $modal) {

    $scope.categories = Categories.slice(1).map(cat => ({
        id: capitalize(cat),
        label: capitalize(cat)
    }));

    $scope.categories.unshift({
        id: null,
        label: 'Any category'
    });

    $scope.severities = [{
        id: 'CRITICAL',
        label: 'Critical'
    }, {
        id: 'ERROR',
        label: 'High'
    }, {
        id: 'WARN',
        label: 'Medium'
    }, {
        id: 'INFO',
        label: 'Low'
    }];

    $scope.severities.unshift({
        id: null,
        label: 'Any Risk'
    });

    $scope.error = {};
    $scope.selectedRule = 'RULE_ID';

    let allRules = Rule.admin().then(function (res) {
        $scope.availableRules = res.data.filter(function (rule) {
            return rule.rule.active && !rule.rule.retired;
        }).map(function (rule) {
            DataUtils.readRule(rule.rule);
            rule.rule.count = rule.count;
            return rule.rule;
        });
    });

    $scope.$watchGroup(['topic.category', 'topic.severity', 'availableRules'], () => {
        if (!$scope.topic || !$scope.availableRules) {
            return;
        }

        if (!$scope.topic.category && !$scope.topic.severity) {
            $scope.implicitRules = [];
            return;
        }

        const category = $scope.topic.category;
        const severity = $scope.topic.severity;

        $scope.implicitRules = $scope.availableRules.filter(rule => {
            return (!category || category === rule.category) &&
                (!severity || severity === rule.severity);
        });
    });

    $scope.availableTags = [];
    $scope.select = {};

    Topic.get($stateParams.id).then(function (res) {
        $scope.topic = res.data;
        $scope.ruleBinding = $scope.topic.ruleBinding;
        $scope.topic.rules.forEach(function (rule) {
            DataUtils.readRule(rule);
        });

        if ($scope.ruleBinding === 'explicit') {
            $scope.topic.rules = sortBy($scope.topic.rules, 'severityNum').reverse();
        } else {
            $scope.topic.rules = [];
        }

        $scope.topicType = ($scope.topic.alwaysShow) ? 'always' : 'default';
        $scope.ruleBinding = $scope.topic.ruleBinding;
        $scope.updateTaggedRules();
    });

    Rule.getAvailableTags().then(function (res) {
        $scope.availableTags = map(res.data, 'name');
    });

    function prepareUpdatePayload (topic) {
        var data = pick(topic,
            ['id', 'title', 'summary', 'content',
            'alwaysShow', 'tag', 'category', 'slug', 'severity']);

        if ($scope.ruleBinding === 'tagged') {
            data.category = data.severity = null;
        } else if ($scope.ruleBinding === 'implicit') {
            data.tag = null;
        } else if ($scope.ruleBinding === 'explicit') {
            data.tag = data.category = data.severity = null;
            data.rules = topic.rules.map(function (rule) {
                return {rule_id: rule.rule_id};
            });
        }

        return data;
    }

    $scope.update = function (topic) {
        var data = prepareUpdatePayload(topic);

        Topic.update(data).then($scope.goBack, function (res) {
            $scope.error = {};
            if (res.status === 400 && res.data.fields) {
                $scope.error = res.data.fields;
            }
        });
    };

    $scope.goBack = function () {
        removeNavigationProtection();
        $state.go('app.admin-topic');
    };

    $scope.addRule = function (rule) {
        $scope.topic.rules.push(rule);
        delete $scope.select.rule;
    };

    $scope.removeRule = function (rule) {
        remove($scope.topic.rules, function (r) {
            return r.rule_id === rule.rule_id;
        });
    };

    $scope.getAvailableRules = function () {
        if ($scope.topic && $scope.topic.rules && $scope.topic.rules.length) {
            return reject($scope.availableRules, function (rule) {
                return find($scope.topic.rules, function (r) {
                    return rule.rule_id === r.rule_id;
                });
            });
        }

        return $scope.availableRules;
    };

    // TODO fix
    $scope.updateTaggedRules = function () {
        if ($scope.topic.tag) {
            allRules.then(function () {
                $scope.taggedRules = $scope.availableRules.filter(function (rule) {
                    return find(rule.tags, {name: $scope.topic.tag});
                });
            });
        }
    };

    // data loss protection
    let navigationWarning =
        'Do you want to leave this form? Changes you made might not be saved.';
    $window.onbeforeunload = function () {
        return navigationWarning;
    };

    let navigationProtectionHandle =
        $rootScope.$on('$stateChangeStart', function (event) {
            if (!confirm(navigationWarning)) {
                event.preventDefault();
            }

            removeNavigationProtection();
        });

    function removeNavigationProtection () {
        $window.onbeforeunload = undefined;
        navigationProtectionHandle();
    }

    $scope.preview = function (topic, summary, details) {
        var data = prepareUpdatePayload(topic);

        $modal.open({
            templateUrl: 'js/components/topics/topicPreviewModal/topicPreviewModal.html',
            windowClass: 'topic-preview-modal ng-animate-enabled',
            backdropClass: 'system-backdrop ng-animate-enabled',
            controller: 'TopicPreviewModalCtrl',
            resolve: {
                topic: function () {
                    return data;
                },

                summary: function () {
                    return summary;
                },

                details: function () {
                    return details;
                }
            }
        });
    };
}

statesModule.controller('EditTopicCtrl', EditTopicCtrl);
