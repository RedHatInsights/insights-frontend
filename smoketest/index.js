/*global require, process, describe, it, after*/

const env       = process.env;
const el        = require('./elements');
const funcs     = require('./funcs');
const nightmare = funcs.getNightmare();

require('should');
require('./check_inputs.js');
require('./extensions')(nightmare);

nightmare.on('console', (log, msg) => {
    console.log(`[browser] ${msg}`);
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
                .click(el.goToApp)
                .wait(el.loginFormUsername)
                .insert(el.loginFormUsername, env.TEST_USERNAME)
                .insert(el.loginFormPassword, env.TEST_PASSWORD)
                .waitAndClick(el.loginFormSubmit)
                .waitAll('nav');
        });
    });

    require('./suites/actions')(nightmare);
    require('./suites/inventory')(nightmare);
    require('./suites/planner')(nightmare);
});
