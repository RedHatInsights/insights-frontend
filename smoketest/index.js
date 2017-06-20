/*global require, process, describe, it, after*/

const env       = process.env;
const el        = require('./elements');
const funcs     = require('./funcs');
const fs        = require('fs');
const URI       = require('urijs');
const nightmare = funcs.getNightmare();

require('should');
require('./check_inputs.js');
require('./extensions')(nightmare);

if (!fs.existsSync('/tmp/images')){
    fs.mkdirSync('/tmp/images');
}

nightmare.on('console', (log, msg) => {
    console.log(`[browser] ${msg}`);
});

nightmare.on('did-stop-loading', function () {
    nightmare.url(function (ignore, url) {
        const image = URI(url).path().replace('/', '').replace(/\//g, '.');
        nightmare.screenshot(`/tmp/images/${image}.png`);
    });
});

describe('Insights Portal Smoke Test', function () {
    this.timeout(45 * 1000);

    after((done) => {
        nightmare.end(done);
    });

    describe('Setup', () => {
        it('should be able to "Go To Application" and login', () => {
            return nightmare
                .goto(funcs.getUrl())
                .getText(el.goToApp)
                .click(el.goToApp)
                .wait(el.loginFormUsername)
                .insert(el.loginFormUsername, env.TEST_USERNAME)
                .insert(el.loginFormPassword, env.TEST_PASSWORD)
                .waitAndClick(el.loginFormSubmit)
                .waitAll('nav')
                .catch((e) => {
                    console.dir(e);
                    nightmare.screenshot('/tmp/images/fail_setup.png');
                });
        });
    });

    require('./suites/actions')(nightmare);
    require('./suites/inventory')(nightmare);
    require('./suites/planner')(nightmare);
});
