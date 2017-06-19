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

nightmare.on('did-stop-loading', function () {
    nightmare.url((link) => {
        console.log(link);
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
                .wrap('click go to app', (n) => {
                    n.goto(funcs.getUrl())
                        .click(el.goToApp);
                })
                .wrap('fill out login form, and submit', (n) => {
                    n.wait(() => { return window.location.href.match(/https:\/\/.*?(\/auth)/); })
                        .wait(el.loginFormUsername)
                        .insert(el.loginFormUsername, env.TEST_USERNAME)
                        .insert(el.loginFormPassword, env.TEST_PASSWORD)
                        .waitAndClick(el.loginFormSubmit);
                })
                .wait(el.overview.severitySummary);
        });
    });

    require('./suites/actions')(nightmare);
    require('./suites/inventory')(nightmare);
    require('./suites/planner')(nightmare);
});
