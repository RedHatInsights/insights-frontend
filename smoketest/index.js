/*global require, casper, process, describe, it, after*/

const env       = process.env;
const lodash    = require('lodash');
const Nightmare = require('nightmare');
const should    = require('should');
const fs        = require('fs');

const el        = require('./elements');
const funcs     = require('./funcs');

if (fs.existsSync('/I_AM_A_RUNNER')) {
    const Xvfb = require('xvfb');
    const xvfb = new Xvfb({
        silent: true
    });
    xvfb.startSync();
}

const nightmare = Nightmare({
    switches: {
        'ignore-certificate-errors': true
    },
    waitTimeout: 20 * 1000,
    show: true
});

require('./extensions')(nightmare);
nightmare.viewport(1024, 768);

nightmare.on('console', (log, msg) => {
    console.log(`[browser] ${msg}`);
});

require('./check_inputs.js');

describe('Insights Portal Smoke Test', function () {
    this.timeout(120 * 1000);
    after((done) => {
        nightmare.end(done);
    });

    describe('Setup', () => {
        it('should be able to "Go To Application" and login', () => {
            return nightmare
                .goto(funcs.getUrl())
                .click(el.goToApp)
                .wait(() => { return window.location.href.match(/https:\/\/.*?(\/auth)/); })
                .wait(el.loginFormUsername)
                .insert(el.loginFormUsername, env.TEST_USERNAME)
                .insert(el.loginFormPassword, env.TEST_PASSWORD)
                .click(el.loginFormSubmit)
                .wait(el.overview.severitySummary);
        });

        describe('Actions', () => {
            it('should be able to get to the System Modal through Actions', (done) => {
                let stash = {};

                nightmare
                    .waitAndClick(el.nav.actions)
                    .waitAll('nav')
                    .waitAll('actions.page1')

                    .waitAndClick(el.actions.page1.legend_security)
                    .waitAll('nav')
                    .waitAll('actions.page2')

                    .waitAndClick(el.actions.page2.firstRuleInTable)
                    .waitAll('nav')
                    .waitAll('actions.page3')
                    .evaluate((el) => {
                        return {
                            ruleNamePage3: document.querySelector(el.actions.page3.ruleTitle).textContent,
                            systemNamePage3: document.querySelector(el.actions.page3.firstSystemInTable).textContent
                        };
                    }, el)
                    .then((stash) => {
                        nightmare
                            .waitAndClick(el.actions.page3.firstSystemInTable)
                            .waitAll('nav')
                            .waitAll('systemModal')
                            .evaluate((el, stash) => {
                                stash.ruleNameModal = document.querySelector(el.systemModal.firstRule).textContent.trim();
                                stash.systemNameModal =  document.querySelector(el.systemModal.hostname).textContent.trim();
                                return stash;
                            }, el, stash)
                            .then((stash) => {
                                stash.ruleNameModal.should.equal(`Security > ${stash.ruleNamePage3}`);
                                stash.systemNamePage3.should.equal(stash.systemNameModal);
                                nightmare.waitAndClick(el.systemModal.exButton)
                                    .waitAll('nav')
                                    .then(done)
                                    .catch(done);
                            });
                    });
            });
        });
    });
});
