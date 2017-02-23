/*global casper*/

casper.waitAndClick = function waitAndClick(selector, cb) {
    if (selector) {
        casper.waitForSelector(selector).thenClick(selector);
        if (cb) { cb.apply(this); }
    } else {
        throw new Error('Test Code Error: waitAndClick got an undefined selector: ' + selector);
    }
};

casper.thenDebugImage = function thenDebugImage() {
    casper.thenCapture('/tmp/tmp.jpg');
};

casper.thenCapture = function thenCapture(path, debug) {
    casper.then(function () {
        if (!debug) {
            casper.capture('/tmp/tmp.jpg');
        }
        casper.capture(path);
    });
};

casper.wrap = function wrap(name, selector, cb, wait) {
    wait = wait || 500;
    casper.then(function () {
        casper.wait(wait, function () {
            console.log('[wrap] step: ' + name);
            casper.waitForSelector(selector);
            casper.thenCapture('/tmp/' + name + '.jpg');
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
