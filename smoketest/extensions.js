/*global require, process, module*/

const lodash  = require('lodash');
const Promise = require('bluebird');
const el      = require('./elements');

module.exports = (nightmare) => {
    nightmare.waitAndClick = (el) => {
        return nightmare.wait(el).click(el);
    };

    nightmare.waitAll = (base) => {
        const dfrds = [];
        const o = lodash.get(el, base);
        if (o) {
            lodash.forOwn(o, function (value, key) { nightmare.wait(value); });
            return nightmare;
        } else {
            throw new Error('Test Code Error: getting requested base from elements: ' + base);
        }
    };
};

