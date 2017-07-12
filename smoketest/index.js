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

[
    'did-stop-loading'
    // 'will-navigate',
    // 'dom-ready',
    // 'did-navigate',
    // 'did-navigate-in-page'
].forEach((event) => {
    nightmare.on(event, nightmare.doScreenShot(event));
});

describe('Insights Portal Smoke Test', function () {
    this.timeout(45 * 1000);

    after((done) => {
        nightmare.end(done);
    });

    describe('Setup', function () {
        it('should be able to "Go To Application" and login', (done) => {
                nightmare
                .goto(funcs.getUrl())
                .waitAndClick(el.goToApp)
                .waitAll('login')
                .insert(el.login.username, env.TEST_USERNAME)
                .insert(el.login.password, env.TEST_PASSWORD)
                .waitAndClick(el.login.submit)
                .waitAll('nav')
                .then(nightmare.myDone(done))
                .catch(nightmare.myDone(done));
        });
    });

    require('./suites/actions')(nightmare);
    require('./suites/inventory')(nightmare);
    require('./suites/planner')(nightmare);
});
