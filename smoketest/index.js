/*global require, casper*/

const env    = require('system').env; // because on the container instance process is not global?
const lodash = require('lodash');
const el     = require('./elements');
const funcs  = require('./funcs');
require('./check_inputs.js');

console.log('Using base: ' + funcs.getUrl(''));
casper.options.waitTimeout = 20 * 1000;

// load my extensions
require('./casper_extensions');

casper.start(funcs.getUrl('/splash/'), function openHome() {
    // require('./mydebug').init(this.page);
    this.page.viewportSize = { width: 1600, height: 900 };
});

casper.wrap('ClickGoToApp', el.goToApp, function clickGoToApp() {
    casper.waitAndClick(el.goToApp);
});

casper.then(function waitForOverviewOrLoginUrl() {
    this.waitForUrl(/https:\/\/.*?(\/auth|\/overview)/);
});

casper.then(function tryLogin () {
    if (!lodash.includes(this.getCurrentUrl(), '/overview')) {
        casper.wrap('FillLoginForm', el.loginForm, function () {
            this.fill(el.loginForm, {
                username: env.TEST_USERNAME,
                password: env.TEST_PASSWORD
            }, true);
        });
    }
});

// Until the run multiple test.begin issue is worked out
// wrap everything in one big test suite
casper.then(function () {
    casper.test.begin('Smoke Test', function (test) {
        casper.test.on('fail', function () {
            casper.thenCapture('/tmp/fail.jpg');
        });

        casper.then(function () {
            test.assertUrlMatch(/https:\/\/.*?\/overview[/]*/, 'After auth we land on Overview');
        });

        require('./suites/actions')(test);
        require('./suites/inventory')(test);
        // require('./suites/planner')(test);

        casper.then(function () {
            test.done();
        });
    });
});

casper.run();
