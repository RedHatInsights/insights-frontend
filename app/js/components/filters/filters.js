'use strict';

var componentsModule = require('../');
var sortBy = require('lodash/collection/sortBy');
var isEmpty = require('lodash/lang/isEmpty');
var isArray = require('lodash/lang/isArray');
var moment = require('moment-timezone');
var map = require('lodash/collection/map');

/**
 * @ngInject
 */
function trust_html($sce) {
    return function (text) {
        return $sce.trustAsHtml(text);
    };
}

function titlecase() {
    function _titleCase(str) {
        return str.toString().toLowerCase().replace(/\b([a-z])/g, function (ch) {
            return ch.toUpperCase();
        });
    }

    return function (value) {
        var newArr = [];

        value = (value === undefined || value === null) ? '' : value;
        if (Array.isArray(value)) {
            angular.forEach(value, function (v) {
                newArr.push(_titleCase(v));
            });

            return newArr;
        } else {
            return _titleCase(value);
        }
    };
}

function sortClass() {
    return function (predicate, match, reverse) {
        if (!predicate) {
            return '';
        }

        if (predicate === match && !reverse) {
            return 'sort-asc';
        }

        if (predicate === match && reverse) {
            return 'sort-desc';
        }

        return '';
    };
}

function orderObjectBy() {
    return function (items, field, reverse) {
        var sorted = sortBy(items, field);
        if (reverse) {
            return sorted.reverse();
        }

        return sorted;
    };
}

function offset() {
    return function (input, start) {
        start = parseInt(start, 10);
        if (input) {
            return input.slice(start);
        }

        return [];
    };
}

function productShortName() {
    return function (input) {
        if (input) {
            return input.replace('Red Hat Enterprise Linux', 'RHEL');
        }

        return input;
    };
}

/*
 * Turns a number from [0,1] interval into a width style attribute (e.g. width="85%")
 * Numbers above or below this interval result in 100% or 0%, respectively.
 */
function toWidth() {
    return function (value) {
        if (isNaN(value)) {
            value = 0;
        } else {
            value = Math.max(0, Math.min(1, value));
        }

        return {width: Math.round(value * 100) + '%'};
    };
}

/**
 * Returns a CSS class for a system based on how long it's been since its last check-in
 * @ngInject
 */
function checkInStyle() {
    return function (system) {
        if (!system.isCheckingIn) {
            return 'text-danger';
        }

        return 'text-success';
    };
}

function momentFilter () {
    return function (input, format, timezone) {
        let result = moment(input);

        if (timezone) {
            result = result.tz(timezone);
        }

        return result.format(format);
    };
}

function searchMaintenancePlans($filter) {
    return function (plans, searchTerm) {
        if (!plans || !isArray(plans)) {
            return [];
        }

        if (!searchTerm) {
            return plans;
        }

        function contains(string) {
            if (string && typeof string !== 'string') {
                string = string.toString();
            }

            return string &&
                   string.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
        }

        function matches (prop) {
            return function (plan) {
                return contains(plan[prop]);
            };
        }

        function matchesAny (array, prop) {
            return function (plan) {
                return map(plan[array], prop).some(contains);
            };
        }

        const predicates = [
            matches('maintenance_id'),
            matches('name'),
            function (plan) {
                return contains($filter('date')(plan.start, 'fullDate'));
            },

            matchesAny('systems', 'hostname'),
            matchesAny('systems', 'display_name'),
            matchesAny('rules', 'description'),
            matchesAny('rules', 'rule_id')
        ];

        return plans.filter(function (plan) {
            // TODO: replace with overSome once we have lodash 4 available
            return predicates.some(function (predicate) {
                return predicate(plan);
            });
        });
    };
}

function timeAgo () {
    return function (time) {
        return moment(time).fromNow();
    };
}

componentsModule.filter('trust_html', trust_html);
componentsModule.filter('titlecase', titlecase);
componentsModule.filter('sortClass', sortClass);
componentsModule.filter('productShortName', productShortName);
componentsModule.filter('orderObjectBy', orderObjectBy);
componentsModule.filter('offset', offset);
componentsModule.filter('toWidth', toWidth);
componentsModule.filter('checkInStyle', checkInStyle);
componentsModule.filter('searchMaintenancePlans', searchMaintenancePlans);
componentsModule.filter('moment', momentFilter);
componentsModule.filter('isEmpty', function () {
    return isEmpty;
});

componentsModule.filter('timeAgo', timeAgo);
