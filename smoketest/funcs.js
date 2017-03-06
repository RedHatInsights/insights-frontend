/*global require, module, process*/

const env     = require('system').env; // because on the container instance process is not global?
const lodash  = require('lodash');
const el      = require('./elements');
const funcs   = {};
const baseUrl = env.TEST_URL;

funcs.getUrl = function getUrl(path) {
    // console.log('getUrl: ' + baseUrl + path);
    return baseUrl + path;
};

funcs.navExists = function navExists(test) {
    funcs.itemsPresent(test, 'nav');
};

funcs.itemPresent = function (test, key) {
    test.assertExists(lodash.get(el, key), 'Element ' + key + ' exists');
};

funcs.itemsPresent = function itemsPresent(test, base) {
    const o = lodash.get(el, base);

    if (o) {
        lodash.forOwn(o, function (value, key) {
            test.assertExists(value, 'Element ' + base + '.' + key + ' exists');
        });
    } else {
        test.fail('Test Code Error: getting requested base from elements: ' + base);
    }
};

funcs.getRandomString = function getRandomString(len) {
    Math.random().toString(33).replace(/[^a-z]+/g, '').substr(0, len);
};

module.exports = funcs;
