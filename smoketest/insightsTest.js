/*global module, require, process*/

// xvfb-run -a --server-args="-screen 0 1600x1200x24"  ./node_modules/chromedriver/bin/chromedriver

const el    = require('./elements').obj;
const utils = require('./utils');
const conf  = {
    username: process.env.TEST_USERNAME,
    password: process.env.TEST_PASSWORD,
    baseUrl:  process.env.TEST_URL
};

module.exports = {
    before: function (client) {
        client.globals.waitForConditionTimeout = 10 * 1000;
        utils.addExtensions(client);
    },

    'Setup (login)': function (client) {
        client.url(`${conf.baseUrl}/overview/`)
            .waitForElementVisible(el.login.form.s)
            .setValue(el.login.username.s, conf.username)
            .setValue(el.login.password.s, conf.password)
            .saveScreenshot('/tmp/images/login.png')
            .custom.waitAndClick(el.login.submit);
    },

    'Actions -> System Modal': function (client) {
        client.custom.createStash();
        client.url(`${conf.baseUrl}/overview/`)
            .waitForElementVisible('body')
            .custom.waitAll('nav')

            .custom.waitAndClick(el.nav.actions)
            .custom.waitAll('nav')
            .custom.waitAll('actions.page1')

            .custom.waitAndClick(el.actions.page1.legend_security)
            .custom.waitAll('nav')
            .custom.waitAll('actions.page2')

            .custom.waitAndClick(el.actions.page2.firstRuleInTable)
            .custom.waitAll('nav')
            .custom.waitAll('actions.page3')
            .custom.getTextAndAddToStash(el.actions.page3.ruleTitle.s, 'ruleNamePage3')
            .custom.getTextAndAddToStash(el.actions.page3.firstSystemInTable.s, 'systemNamePage3')

            .custom.waitAndClick(el.actions.page3.firstSystemInTable)
            .custom.waitAll('systemModal')

            .custom.performWithStash(function (stash, done) {
                client.expect.element(el.systemModal.firstRule.s).text.to.equal(`Security > ${stash.ruleNamePage3}`.trim());
                client.expect.element(el.systemModal.hostname.s).text.to.equal(stash.systemNamePage3);
                client.custom.waitAndClick(el.systemModal.exButton).pause(125);
                done();

            });
    },

    'Inventory -> SystemModal': function (client) {
        client.custom.createStash();
        client.custom.waitAndClick(el.nav.inventory).custom.waitAndClick(el.nav.inventory)
            .custom.waitAll('nav')
            .custom.waitAll('inventory')
            .custom.getTextAndAddToStash(el.inventory.firstSystemInTable.s, 'systemName')

            .custom.waitAndClick(el.inventory.firstSystemInTable)
            .custom.waitAll('systemModal')
            .custom.performWithStash(function (stash, done) {
                client.expect.element(el.systemModal.hostname.s).text.to.equal(stash.systemName);
                client.custom.waitAndClick(el.systemModal.exButton);
                client.custom.waitAll('nav');
                done();
            });
    },

    'Logout': function (client) {
        client.url(`${conf.baseUrl}/`) // go to the portal before testing this logout thing (to pick up a complete Portal session)
            .pause(100)
            .url(`${conf.baseUrl}/overview/`)
            .custom.waitAll('nav')
            .custom.waitAndClick(el.nav.logout)
            .custom.waitAndClick(el.loggedOutPage.logBackIn);
    },

    after: function (client) {
        client.end();
    }
};
