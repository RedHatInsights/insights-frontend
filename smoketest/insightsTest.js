/*global module, require, process*/

// xvfb-run -a --server-args="-screen 0 1600x1200x24"  ./node_modules/chromedriver/bin/chromedriver

const el    = require('./elements');
const utils = require('./utils');
const conf  = {
    username: process.env.TEST_USERNAME,
    password: process.env.TEST_PASSWORD,
    baseUrl:  process.env.TEST_URL
};

module.exports = {
    before: function (client) {
        client.globals.waitForConditionTimeout = 33 * 1000;
        utils.addExtensions(client);
    },

    'Setup (login)': function (client) {
        client.url(`${conf.baseUrl}/overview/`)
            .waitForElementVisible(el.login.form)
            .setValue(el.login.username, conf.username)
            .setValue(el.login.password, conf.password)
            .saveScreenshot('/tmp/images/login.png')
            .click(el.login.submit);
    },

    'Actions -> System Modal': function (client) {
        client.createStash();
        client.url(`${conf.baseUrl}/overview/`)
            .waitForElementVisible('body')
            .waitAll('nav')

            .waitAndClick(el.nav.actions)
            .waitAll('nav')
            .waitAll('actions.page1')

            .waitAndClick(el.actions.page1.legend_security)
            .waitAll('nav')
            .waitAll('actions.page2')

            .waitAndClick(el.actions.page2.firstRuleInTable)
            .waitAll('nav')
            .waitAll('actions.page3')
            .getTextAndAddToStash(el.actions.page3.ruleTitle, 'ruleNamePage3')
            .getTextAndAddToStash(el.actions.page3.firstSystemInTable, 'systemNamePage3')

            .waitAndClick(el.actions.page3.firstSystemInTable)
            .waitAll('systemModal')

            .performWithStash(function (stash, done) {
                client.expect.element(el.systemModal.firstRule.trim()).text.to.equal(`Security > ${stash.ruleNamePage3}`.trim());
                client.expect.element(el.systemModal.hostname).text.to.equal(stash.systemNamePage3);
                client.waitAndClick(el.systemModal.exButton).pause(125);
                done();

            });
    },

    'Inventory -> SystemModal': function (client) {
        client.createStash();
        client.waitAndClick(el.nav.inventory).waitAndClick(el.nav.inventory)
            .waitAll('nav')
            .waitAll('inventory')
            .getTextAndAddToStash(el.inventory.firstSystemInTable, 'systemName')

            .waitAndClick(el.inventory.firstSystemInTable)
            .waitAll('systemModal')
            .performWithStash(function (stash, done) {
                client.expect.element(el.systemModal.hostname).text.to.equal(stash.systemName);
                client.waitAndClick(el.systemModal.exButton);
                client.waitAll('nav');
                done();
            });
    },

    after: function (client) {
        client.end();
    }
};
