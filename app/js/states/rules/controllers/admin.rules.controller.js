'use strict';

var statesModule = require('../../');
var includes = require('lodash/collection/includes');
var indexBy = require('lodash/collection/indexBy');
var map = require('lodash/collection/map');
var pick = require('lodash/object/pick');

const SEARCH_PROPS = [
    'rule_id',
    'rule.description'
];

function closestByClass(el, className) {
    while (el && el !== document) {
        let p = el.parentNode;
        let classes = ((p && p.className) || '').split(/\s+/);
        if (includes(classes, className)) {
            return p;
        } else {
            el = p;
        }
    }

    return null;
}

/**
 * @ngInject
 */
function AdminRuleCtrl(
    $scope,
    $state,
    $filter,
    $document,
    Rule,
    User,
    PermissionService,
    SweetAlert,
    $stateParams,
    Utils,
    MultiButtonService,
    Categories,
    DataUtils) {

    $scope.predicate = 'count';
    $scope.reverse = true;
    $scope.toggled = null;
    $scope.canDelete = false;
    $scope.pager = new Utils.Pager(1000);
    $scope.loader = new Utils.Loader(false);
    $scope.exportRules = Rule.exportRules;
    $scope.RULE_ADMIN_CAT_FILTER_KEY = MultiButtonService.RULE_ADMIN_CAT_FILTER_KEY;
    $scope.includes = includes;

    const filterFn = $filter('filter');
    const orderBy = $filter('orderBy');
    const offset = $filter('offset');
    const limitTo = $filter('limitTo');

    $scope.newRule = {};

    $scope.availableTags = [];
    $scope.tags = [];
    $scope.suggestTag = function (query) {
        return $scope.availableTags.filter(function (tag) {
            return tag.name.indexOf(query) !== -1;
        });
    };

    Rule.getAvailableTags().then(function (res) {
        $scope.availableTags = res.data;
        if (angular.isDefined($stateParams.tags)) {
            let tags = $stateParams.tags;
            let indexed = indexBy($scope.availableTags, 'name');
            if (!Array.isArray(tags)) {
                tags = [tags.toString()];
            }

            $scope.tags = tags.filter(function (tag) {
                return tag in indexed;
            }).map(function (tag) {
                return indexed[tag];
            });
        }
    });

    $scope.load = $scope.loader.bind(function () {
        return Rule.admin().success(function (rules) {
            rules.forEach(r => DataUtils.readRule(r.rule));
            rules.forEach(DataUtils.readRuleState);
            $scope._rules = rules;
            filter();
        });
    });

    $scope.load();

    function canDelete(user) {
        $scope.canDelete =
            (user &&
            user.is_internal &&
            PermissionService.has(user, PermissionService.PERMS.CONTENT_MANAGER));
    }

    User.asyncCurrent(canDelete);

    /*
     * Rule processing pipeline
     */

    // phase 1 - filter based on category, state and tags
    function filter() {
        if (!$scope._rules) {
            return;
        }

        $scope.filteredRules = $scope._rules;

        if ($scope.tab !== 'all') {
            $scope.filteredRules = filterFn($scope.filteredRules, function (rule) {
                return rule.state === $scope.tab;
            });
        }

        // category filter
        const selectedCategory = getSelectedCategory();
        if (selectedCategory !== 'all') {
            $scope.filteredRules = $scope.filteredRules.filter(r => r.rule.category &&
                r.rule.category.toLowerCase() === selectedCategory);
        }

        if (angular.isDefined($scope.filteredRules) && $scope.tags.length) {
            $scope.filteredRules = $scope.filteredRules.filter(function (rule) {
                return $scope.tags.every(function (tag) {
                    return angular.isDefined(rule.rule.tags) &&
                        rule.rule.tags.some(function (ruleTag) {
                            return tag.name === ruleTag.name;
                        });
                });
            });
        }

        $scope.search();
    }

    // phase 2 - search
    $scope.search = function (query) {
        if (angular.isDefined(query)) {
            $scope.searchQuery = query; // store it in scope for subsequent pipeline calls
        }

        query = query || $scope.searchQuery;
        if (query && query.length) {
            query = query.toLowerCase();
            $scope.searchedRules = $scope.filteredRules.filter(function (rule) {
                return SEARCH_PROPS.some(function (prop) {
                    return Utils.get(rule, prop, '').toLowerCase().includes(query);
                });
            });
        } else {
            $scope.searchedRules = $scope.filteredRules;
        }

        $scope.order();
    };

    // phase 3 - order
    $scope.order = function () {
        const predicate = ($scope.reverse ? '-' + $scope.predicate : $scope.predicate);
        $scope.orderedRules = orderBy($scope.searchedRules, predicate);
        $scope.pager.currentPage = 1;
        $scope.page();
    };

    // phase 4 - pagination
    $scope.page = function () {
        $scope.pager.update();
        $scope.currentRules = offset($scope.orderedRules, $scope.pager.offset);
        $scope.currentRules = limitTo($scope.currentRules, $scope.pager.perPage);
    };

    $scope.$watchGroup(['predicate', 'reverse'], $scope.order);

    function getSelectedCategory() {
        return Categories.find(c => MultiButtonService.getState(
            MultiButtonService.RULE_ADMIN_CAT_FILTER_KEY + c));
    }

    $scope.categorySelected = function () {
        window.localStorage.setItem(
            'insights:' + MultiButtonService.RULE_ADMIN_CAT_FILTER_KEY,
            getSelectedCategory());
        filter();
    };

    $scope.activateTab = function (tabName) {
        $scope.tab = tabName;
        filter();
    };

    $scope.toggleTray = function (record) {
        if ($scope.toggled === record) {
            $scope.toggled = null;
            return;
        }

        $scope.toggled = record;
    };

    $scope.isToggled = function (record) {
        return $scope.toggled === record;
    };

    $scope.isTabActive = function (tabs) {
        return includes(tabs, $scope.tab);
    };

    function createAndGo(info) {
        // API fails if we include anything else in the payload
        // https://trello.com/c/Srhzlppg/37
        info = pick(info, ['error_key', 'plugin']);
        Rule.create(info).success(function (info) {
            $state.go('app.edit-rule', {
                id: info.rule_id,
                newRule: true
            });
        });
    }

    $scope.createRule = function () {
        createAndGo($scope.newRule);
    };

    $scope.createRecord = function (r) {
        createAndGo(r.rule);
    };

    $scope.deactivateRecord = function (r) {
        var record = r.rule;
        record.active = r.active = false;
        Rule.update(record).then(filter);
    };

    $scope.activateRecord = function (r) {
        var record = r.rule;
        record.active = r.active = true;
        Rule.update(record).then(filter);
    };

    $scope.unretireRecord = function (r) {
        var record = r.rule;
        record.retired = r.retired = false;
        Rule.update(record).then(filter);
    };

    $scope.retireRecord = function (r) {
        var record = r.rule;
        record.retired = r.retired = true;
        Rule.update(record).then(filter);
    };

    $scope.deleteRecord = function (r) {
        var record = r.rule;

        function _deleteRecord() {
            Rule.delete(record).then(function () {
                let len = $scope._rules.length;
                for (let i = 0; i < len; i++) {
                    if ($scope._rules[i].rule_id &&
                        $scope._rules[i].rule_id === record.rule_id) {

                        $scope._rules.splice(i, 1);
                        return;
                    }
                }
            });
        }

        let confirmText =
            'Do you really want to delete <code>' + record.rule_id + '</code>?';
        if (r.count) {
            confirmText += '<br><br><strong>Note:</strong> This rule has hits. ' +
                'If deleted it will still show up in needs content.';
        }

        SweetAlert.swal({
            title: 'Are you sure?',
            text: confirmText,
            type: 'warning',
            confirmButtonColor: '#DD6B55',
            confirmButtonText: 'Yes',
            html: true,
            showCancelButton: true
        }, function (isConfirm) {
            if (isConfirm) {
                _deleteRecord();
            }
        });
    };

    function clickListener(e) {
        if (!closestByClass(e.target, 'utilities-tray')) {
            $scope.$apply($scope.toggleTray);
        }
    }

    $scope.$watchCollection('_rules', filter);
    $scope.$watchCollection('tags', function (value) {
        filter();

        // update query params
        $state.go('app.admin-rules', {tags: map(value, 'name')}, {
            notify: false,
            reload: false,
            location: 'replace'
        });
    });

    $document.on('click', clickListener);
    $scope.$on('$destroy', function () {
        $document.off('click', clickListener);
    });
}

statesModule.controller('AdminRuleCtrl', AdminRuleCtrl);
