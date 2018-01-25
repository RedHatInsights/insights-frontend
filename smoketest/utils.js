/*global module, require*/

const lodash = require('lodash');
const el     = require('./elements').obj;
const priv   = {};
let stash    = {};
let counter  = 0;

priv.getFileName = function (element) {
    counter += 1;
    return `/tmp/images/${counter}-${element.path}.png`;
};

module.exports.addExtensions = (client) => {

    client.custom = {};

    client.custom.performWithStash = (func) => {
        return client.perform(function (client, done) {
            func(stash, done);
        });
    };

    client.custom.createStash = () => {
        stash = {};
        return client;
    };

    client.custom.addToStash = (name, value) => {
        stash[name] = value;
    };


    client.custom.getStash = () => {
        return stash;
    };

    client.custom.getTextAndAddToStash = (selector, name) => {
        return client.getText(selector, function (result) {
            client.custom.addToStash(name, result.value);
        });
    };

    client.custom.waitAndClick = (element) => {
        return client.custom.say(`Waiting to click ${element.path}`)
            .pause(100)
            .saveScreenshot(priv.getFileName(element))
            .waitForElementVisible(element.selector)
            .click(element.selector);
    };

    client.custom.say = (msg) => {
        return client.perform(() => {
            console.log(`\n-- ${msg} --`);
        });
    };

    client.custom.waitAll = (base) => {
        const o = lodash.get(el, base);
        if (o) {
            client.custom.say(`Waiting for all elements on ${base}`);
            lodash.forOwn(o, function (value) {
                client.waitForElementVisible(value.selector);
            });
            return client;
        } else {
            throw new Error('Test Code Error: getting requested base from elements: ' + base);
        }
    };
};
