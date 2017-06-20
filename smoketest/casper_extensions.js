/*global casper, require, process*/

const env    = process.env;
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
    casper.thenCapture('debug');
};

casper.thenCapture = function thenCapture(name) {
    casper.then(function () {
        if (name !== 'debug') { casper.capture(IMAGE_BASE_PATH + '/debug.jpg'); }
        casper.capture(IMAGE_BASE_PATH + '/' + name + '.jpg');
    });
};

casper.wrap = function wrap(name, selector, cb, wait) {
    wait = wait || 120;
    casper.then(function () {
        casper.thenCapture(name);
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
