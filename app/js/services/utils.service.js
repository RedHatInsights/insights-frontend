/*global window, document, angular, require*/
'use strict';

const servicesModule = require('./');
const forOwn = require('lodash/forOwn');
const upperFirst = require('lodash/upperFirst');
const groupBy = require('lodash/groupBy');
const values = require('lodash/values');
const get = require('lodash/get');

function Pager (perPage) {
    this.perPage = perPage || 15;
    this.reset();
}

Pager.prototype.update = function () {
    this.offset = (this.currentPage - 1) * this.perPage;
};

Pager.prototype.reset = function () {
    this.currentPage = 1;
    this.update();
};

function Utils($filter, $rootScope, Events) {
    var utils = {};

    utils.generateAccessors = function (pub, vars) {
        // console.time('generateAccessors');
        forOwn(vars, function (ignore, key) {
            const cap = upperFirst(key);
            const getter = 'get' + cap;
            const setter = 'set' + cap;

            pub[getter] = function () {
                // for debugging dont delete
                // console.log({ func: getter, ret: vars[key] });
                return vars[key];
            };

            pub[setter] = function (input) {
                // for debugging dont delete
                // console.log({ func: setter, arg: input });
                vars[key] = input;
            };

            // console.timeEnd('generateAccessors');
        });
    };

    utils.selectBetween = function (target, source, items) {
        function getDataId (element) {
            return element.getAttribute('data-id');
        }

        target = utils.findFirstAncestor(target, getDataId);
        source = utils.findFirstAncestor(source, getDataId);
        let parent = target.parentElement;

        let children = Array.prototype.slice.call(
            angular.element(parent).children());
        let start = children.indexOf(target);
        let end = children.indexOf(source);

        angular.forEach(children.slice(Math.min(start, end), Math.max(start, end) + 1),
            function (e) {
                var id = e.getAttribute('data-id');
                items[id] = true;
            });
    };

    utils.escapeHtml = function (str) {
        var div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    };

    utils.resetChecked = function (checkboxes) {
        return function () {
            checkboxes.checked = false;
            checkboxes.items = {};
        };
    };

    utils.checkboxChecked = function (value, data, items, idProperty) {
        idProperty = idProperty || 'system_id';
        angular.forEach(data, function (element) {
            if (angular.isDefined(element[idProperty])) {
                items[element[idProperty]] = value;
            }
        });
    };

    utils.itemsChanged = function (data, items, idProperty) {
        idProperty = idProperty || 'system_id';
        if (!data || !data.length) {
            return {
                checked: false,
                totalChecked: 0,
                indeterminate: false
            };
        }

        let checked = 0;
        let unchecked = 0;
        let total = data.length;

        angular.forEach(data, function (element) {
            checked += (items[element[idProperty]]) || 0;
            unchecked += (!items[element[idProperty]]) || 0;
        });

        let result = {
            totalChecked: checked,
            indeterminate: (checked !== 0 && unchecked !== 0)
        };
        if ((unchecked === 0) || (checked === 0)) {
            result.checked = (checked === total);
        }

        return result;
    };

    utils.rowClick = function (checkboxes) {
        return function ($event, id) {
            var target = $event.target || $event.srcElement;
            if (target.tagName === 'A') {
                return;
            }

            if ($event.shiftKey && $event.type === 'mousedown') {
                // Prevents selection of rows on shift+click
                $event.preventDefault();
                return false;
            }

            if ((target.tagName === 'TD' || target.tagName === 'SPAN') &&
                    $event.type === 'click') {
                checkboxes.items[id] = !checkboxes.items[id];
            }

            target = $event.currentTarget;
            if (!checkboxes.lastClicked) {
                checkboxes.lastClicked = target;
                return;
            }

            if ($event.shiftKey) {
                utils.selectBetween(target, checkboxes.lastClicked, checkboxes.items);
            }

            checkboxes.lastClicked = target;
        };
    };

    utils.findFirstAncestor = function (element, predicate) {
        while (!predicate(element) && element) {
            element = element.parentElement;
        }

        return element;
    };

    utils.isBeta = function () {
        return window.insightsGlobal && window.insightsGlobal.isBeta;
    };

    function wrap (array, replaceWith, wrapAs) {
        var item;

        if (!array.length ||
            !(replaceWith in array[0]) ||
            (array[0][replaceWith] === null)) {
            return {};
        }

        item = array[0][replaceWith];
        item[wrapAs] = array;
        return item;
    }

    utils.groupByObject = function (array, iteratee, object, wrapAs) {
        //groupBy(array, iteratee): creates a map of system_id to it's reports
        //  - this could be done with GET /systems?report_count=gt0
        //values(groupBy(array, iteratee)): creates an array of the reports
        //wrap(subArray, object, wrapAs): creates a system object with a list of actions.
        //  This could be done with GET /systems/:id/reports
        return values(groupBy(array, iteratee)).map(function (subArray) {
            return wrap(subArray, object, wrapAs);
        });
    };

    /*
     * Assign the value of the source property of an object to the target property.
     */
    utils.alias = function (source, target) {
        return function (item) {
            if (angular.isObject(item) && source in item) {
                item[target] = item[source];
            }
        };
    };

    utils.watchOnce = function (scope, expression, fn) {
        var handle = scope.$watch(expression, function () {
            fn.apply(null, arguments);
            handle();
        });
    };

    utils.Pager = Pager;

    utils.Checkboxes = function (idProperty) {
        var self = this;
        this.idProperty = idProperty || 'id';
        this.reset = utils.resetChecked(this);
        this.reset();
        this.rowClick = utils.rowClick(this);
        $rootScope.$on(Events.checkboxes.reset, function () {
            self.reset();
        });
    };

    utils.Checkboxes.prototype.checkboxChecked = function (value, data) {
        utils.checkboxChecked(value, data, this.items, this.idProperty);
    };

    utils.Checkboxes.prototype.update = function (data) {
        var result = utils.itemsChanged(data, this.items, this.idProperty);
        this.totalChecked = result.totalChecked;
        this.indeterminate = result.indeterminate;
        if (angular.isDefined(result.checked)) {
            this.checked = result.checked;
        }
    };

    utils.Checkboxes.prototype.isChecked = function (id) {
        return id in this.items && this.items[id];
    };

    utils.Checkboxes.prototype.getSelected = function (data) {
        var self = this;
        return data.filter(function (item) {
            return self.isChecked(item[self.idProperty]);
        });
    };

    utils.Sorter = function (implicitOrder, cb) {
        if (implicitOrder) {
            this.predicate = implicitOrder.predicate;
            this.reverse = implicitOrder.reverse;
        } else {
            this.predicate = '';
            this.reverse = false;
        }

        this.cb = cb;
    };

    utils.Sorter.prototype.sort = function (name) {
        this.reverse = (this.predicate === name) ? !this.reverse : false;
        this.predicate = name;
        if (this.cb) {
            this.cb();
        }
    };

    utils.Sorter.prototype.getSortDirection = function () {
        return this.reverse ? 'DESC' : 'ASC';
    };

    utils.Sorter.prototype.getSortClass = function (name) {
        return $filter('sortClass')(this.predicate, name, this.reverse);
    };

    /*
     * Holds state for a "loading" spinner
     */
    utils.Loader = function (deflectWhenLoading) {
        this.loading = false;
        if (angular.isDefined(deflectWhenLoading)) {
            this.deflectWhenLoading = deflectWhenLoading;
        } else {
            this.deflectWhenLoading = true;
        }
    };

    utils.Loader.prototype.bind = function (fn, thisArg) {
        var self = this;
        var value;

        function done (value) {
            self.loading = false;
            return value;
        }

        return function () {
            if (self.deflectWhenLoading && self.loading) {
                return;
            }

            self.loading = true;
            value = fn.apply(thisArg, arguments);
            if (angular.isDefined(value) && angular.isDefined(value.then)) {
                return value.then(done, done);
            }

            done();
            return value;
        };
    };

    utils.getNextQueryPrependChar = function (url) {
        var prependChar = '?';
        if (url.indexOf('?') > -1) {
            prependChar = '&';
        }

        return prependChar;
    };

    utils.addQueryToUrl = function (url, query) {
        var key;
        var prependChar;
        for (key in query) {
            prependChar = this.getNextQueryPrependChar(url);
            url += prependChar + key + '=' + query[key];
        }

        return url;
    };

    utils.getSystemDisplayName = function (system) {
        var name = false;
        if (system) {
            if (system.display_name) {
                name = system.display_name;
            } else if (system.hostname) {
                name = system.hostname;
            } else {
                name = 'UUID: ' + system.system_id;
            }
        }

        // stash the display name for filtration!
        system.displayName = name;
        return name;
    };

    /*
     * Lodash' get() that also defaults on null
     */
    utils.get = function (object, propName, defaultValue) {
        const value = get(object, propName, defaultValue);
        if (value === null && angular.isDefined(defaultValue)) {
            return defaultValue;
        }

        return value;
    };

    utils.datesEqual = function (d1, d2) {
        if (d1 === d2) {
            return true;
        }

        return new Date(d1).getTime() === new Date(d2).getTime();
    };

    utils.localStorage = {};

    utils.localStorage.getItem = (key, unstringify) => {
        if (window.localStorage) {
            if (unstringify) {
                return JSON.parse(window.localStorage.getItem(key));
            }

            return window.localStorage.getItem(key);
        }

        return false;
    };

    utils.localStorage.setItem = (key, value, stringify) => {
        if (window.localStorage) {
            if (stringify) {
                value = JSON.stringify(value);
            }

            window.localStorage.setItem(key, value);
        }

        return false;
    };

    return utils;
}

servicesModule.service('Utils', Utils);
