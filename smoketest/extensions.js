/*global require, process, module*/

const env       = process.env;
const Nightmare = require('nightmare');
const lodash    = require('lodash');
const URI       = require('urijs');
const funcs     = require('./funcs');
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


    nightmare.myDone = (done) => {
        return () => {
            nightmare.doScreenShot('STEPEND', done)();
        };
    };

    let imageCounter = 0;
    let lastImage = "";
    nightmare.doScreenShot = (event, cb) => {
        cb = cb || funcs.noop;
        return () => {
            nightmare.url(function (ignore, url) {
                try {
                    const image = `${URI(url).path()}-${event}.png`.replace('/', '').replace(/[\/-]/g, '.').replace(/[.]{2,}/g, '.');
                    if (image !== lastImage) {
                        const path  = `/tmp/images/${env.TEST_TRY_NUM}/${imageCounter}.${image}`;
                        nightmare.screenshot(path).then(cb).catch(cb);
                        lastImage = image;
                        imageCounter += 1;
                    }
                } catch (e) {}
            }).then(cb).catch(cb);
        };
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
