/*global module, require*/

const lodash = require('lodash');
const el     = require('./elements');
const priv   = {};
let stash    = {};
let counter  = 0;

priv.getFileName = function () {
    counter += 1;
    return `/tmp/images/${counter}.png`;
};

module.exports.addExtensions = (client) => {

    client.performWithStash = (func) => {
        return client.perform(function (client, done) {
            func(stash, done);
        });
    };

    client.createStash = () => {
        stash = {};
        return client;
    };

    client.addToStash = (name, value) => {
        stash[name] = value;
    };


    client.getStash = () => {
        return stash;
    };

    client.getTextAndAddToStash = (selector, name) => {
        return client.getText(selector, function (result) {
            client.addToStash(name, result.value);
        });
    };

    client.waitAndClick = (element) => {
        return client.pause(100)
            .saveScreenshot(priv.getFileName())
            .waitForElementVisible(element)
            .click(element);
    };

    client.waitAll = (base) => {
        const o = lodash.get(el, base);
        if (o) {
            lodash.forOwn(o, function (value) {
                client.waitForElementVisible(value);
            });
            return client;
        } else {
            throw new Error('Test Code Error: getting requested base from elements: ' + base);
        }
    };
};
