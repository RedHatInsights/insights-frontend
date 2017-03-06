/*global casper, module, require*/

const el    = require('../elements');
const funcs = require('../funcs');
const stash = {};

module.exports = function (test) {
    casper.thenOpen(funcs.getUrl('/overview/'));

    // click the inventory nav
    casper.waitAndClick(el.nav.inventory);
    casper.wrap('InventoryPage', el.inventory.firstSystemInTable, function () {
        funcs.navExists(test);
        funcs.itemsPresent(test, 'inventory');
        this.evaluate(function setupInventoryInputs(checkinSelect, actionsSelect, searchBox) {
            try {
                window.jQuery(checkinSelect).click();
                window.jQuery(actionsSelect).click();
                window.jQuery(searchBox).val('usersys').change();
            } catch (e) {
                console.error(e);
            }
        }, el.jQuery.inventory.checkinSelect, el.jQuery.inventory.actionsSelect, el.jQuery.inventory.searchBox);
    });

    casper.wait(2000); // shitty, we need a loading spinner to monitor

    casper.waitForSelectorTextChange(el.inventory.systemCount, function() {
        stash.systemName = casper.fetchText(el.inventory.firstSystemInTable);
    });

    casper.waitAndClick(el.inventory.firstSystemInTable);
    casper.wait(2000); // just to make the picture purty
    casper.wrap('Inventory_SystemModal', el.systemModal.firstRule, function () {
        funcs.navExists(test);
        funcs.itemsPresent(test, 'systemModal');
        test.assertEquals(casper.fetchText(el.systemModal.hostname), stash.systemName);
    });
};
