/*global require, process, module*/

const Nightmare = require('nightmare');
const lodash    = require('lodash');
const el        = require('./elements');

Nightmare.action(
    'getText',
    function (selector, done) {
        this.evaluate_now(function (selector) {
            return document.querySelector(selector).textContent;
        }, done, selector);
    }
);

Nightmare.action(
    'getStash',
    function (stash, done) {
        this.evaluate_now(function (stash) {
            window._.forOwn(stash.selectors, (v, k) => {
                stash.results[k] = document.querySelector(v).textContent;
                delete stash.selectors[k];
            });
            return stash;
        }, done, stash);
    }
);

module.exports = (nightmare) => {
    nightmare.waitAndClick = (el) => {
        return nightmare
            .wait(el)
            .click(el);
    };

    nightmare.waitAll = (base) => {
        const o = lodash.get(el, base);
        if (o) {
            lodash.forOwn(o, function (value) { nightmare.wait(value); });
            return nightmare;
        } else {
            throw new Error('Test Code Error: getting requested base from elements: ' + base);
        }
    };
};

