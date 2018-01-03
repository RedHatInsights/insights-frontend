/*global require, angular*/
'use strict';

var componentsModule = require('../');
var sortBy = require('lodash/sortBy');
var isEmpty = require('lodash/isEmpty');
var isArray = require('lodash/isArray');
var moment = require('moment-timezone');
var map = require('lodash/map');
const overSome = require('lodash/overSome');
const groupBy = require('lodash/groupBy');
const memoize = require('lodash/memoize');
const values = require('lodash/values');
const orderBy = require('lodash/orderBy');
const partial = require('lodash/partial');

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
            return 'sort-desc';
        }

        if (predicate === match && reverse) {
            return 'sort-asc';
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

function searchMaintenancePlans ($filter, plans, searchTerm) {
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
            return plan.name === null && contains('Unnamed plan');
        },

        function (plan) {
            return contains($filter('date')(plan.start, 'fullDate'));
        },

        matchesAny('systems', 'hostname'),
        matchesAny('systems', 'display_name'),
        matchesAny('rules', 'description'),
        matchesAny('rules', 'rule_id')
    ];

    const someMatches = overSome(predicates);
    return plans.filter(someMatches);
}

function timeAgo () {
    return function (time) {
        return moment(time).fromNow();
    };
}

function getSystemDisplayName (Utils) {
    return function (system) {
        return Utils.getSystemDisplayName(system);
    };
}

function groupPlans (plans) {
    plans.forEach(plan => plan.month = moment(plan.start).format('YYYY-MM'));
    return orderBy(values(groupBy(plans, 'month')), ['0.month'], ['desc']);
}

function cached (fn, keyFn, $rootScope, ...events) {
    const wrapped = memoize(fn, keyFn);
    events.forEach(event => $rootScope.$on(event, () => wrapped.cache.clear()));
    return wrapped;
}

componentsModule.filter('trust_html', trust_html);
componentsModule.filter('titlecase', titlecase);
componentsModule.filter('sortClass', sortClass);
componentsModule.filter('productShortName', productShortName);
componentsModule.filter('orderObjectBy', orderObjectBy);
componentsModule.filter('offset', offset);
componentsModule.filter('toWidth', toWidth);
componentsModule.filter('checkInStyle', checkInStyle);
componentsModule.filter('moment', momentFilter);
componentsModule.filter('getSystemDisplayName', getSystemDisplayName);
componentsModule.filter('isEmpty', function () {
    return isEmpty;
});

componentsModule.filter('timeAgo', timeAgo);

componentsModule.filter('searchMaintenancePlans', function ($filter, $rootScope, Events) {
    return cached(
        partial(searchMaintenancePlans, $filter),
        (plans, searchTerm) => `${searchTerm}|${map(plans, 'maintenance_id').join(',')}`,
        $rootScope,
        Events.planner.plansLoaded); // flush cache when plans reloaded
});

componentsModule.filter('groupPlans', function ($rootScope, Events) {
    return cached (
        groupPlans,
        plans => map(plans, plan => `${plan.maintenance_id}:${plan.start}`).join(','),
        $rootScope,
        Events.planner.plansLoaded); // flush cache when plans reloaded
});
