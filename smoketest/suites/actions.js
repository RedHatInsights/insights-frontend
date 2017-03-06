/*global casper, module, require*/

const el    = require('../elements');
const funcs = require('../funcs');
const stash = {};

module.exports = function (test) {
    casper.thenOpen(funcs.getUrl('/overview/'));

    // click the actions nav
    casper.waitAndClick(el.nav.actions);
    casper.wrap('ActionsStep1', el.actions.page1.donutHole, function () {
        funcs.navExists(test);
        funcs.itemsPresent(test, 'actions.page1');
        test.assertSelectorHasText(el.actions.page1.legend_security, 'Security');
    });

    // click the security legend thing under the wheel
    casper.waitAndClick(el.actions.page1.legend_security);
    casper.wrap('ActionsStep2', el.actions.page2.firstRuleInTable, function () {
        funcs.navExists(test);
        funcs.itemsPresent(test, 'actions.page2');
        test.assertSelectorHasText(el.actions.page2.categoryTitle, 'Security');
    });

    // click on the first security rule in the table
    casper.waitAndClick(el.actions.page2.firstRuleInTable);
    casper.wrap('ActionsStep3', el.actions.page3.firstSystemInTable, function () {
        funcs.navExists(test);
        funcs.itemsPresent(test, 'actions.page3');
        stash.ruleName = casper.fetchText(el.actions.page3.ruleTitle);
        stash.systemName = casper.fetchText(el.actions.page3.firstSystemInTable);
    });

    // click on the first system in the table
    casper.waitAndClick(el.actions.page3.firstSystemInTable);
    casper.wrap('ActionsStep4_SystemModal', el.systemModal.firstRule, function () {
        funcs.navExists(test);
        funcs.itemsPresent(test, 'systemModal');
        test.assertSelectorHasText(el.systemModal.firstRule, 'Security > ' + stash.ruleName.trim());
        test.assertSelectorHasText(el.systemModal.hostname, stash.systemName);
    });
    casper.waitAndClick(el.systemModal.exButton);
};
