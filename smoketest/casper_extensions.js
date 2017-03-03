/*global casper*/

const env             = require('system').env; // because on the container instance process is not global?
const IMAGE_BASE_PATH = '/tmp/images/' + env.TEST_TRY_NUM;

casper.waitAndClick = function waitAndClick(selector, cb) {
    if (selector) {
        casper.waitForSelector(selector, function clickSelector() {
            this.click(selector);
        });
        if (cb) { cb.apply(this); }
    } else {
        throw new Error('Test Code Error: waitAndClick got an undefined selector: ' + selector);
    }
};

casper.thenDebugImage = function thenDebugImage() {
    casper.thenCapture(null, true);
};

casper.thenCapture = function thenCapture(name, debug) {
    casper.then(function () {
        if (debug) { casper.capture(IMAGE_BASE_PATH + '/tmp.jpg'); }
        casper.capture(IMAGE_BASE_PATH + '/' + name + '.jpg');
    });
};

casper.wrap = function wrap(name, selector, cb, wait) {
    wait = wait || 500;
    casper.then(function () {
        casper.wait(wait, function () {
            console.log('\n[wrap] step: ' + name);
            casper.waitForSelector(selector);
            casper.thenCapture(name);
            if (cb) {
                casper.then(function () {
                    cb.apply(this);
                });
            }
        });
    });
};

// NOTE: this does not work, just leaving it here in case I figure it out
var planned = 0;
casper.wrapTest = function wrapTest(name, selector, cb, wait) {
    casper.then(function () {
        casper.wrap(name, selector, function () {
            casper.test.begin(name + 'Test', planned, cb);
            planned += 1;
        }, wait);
    });
};
